/* eslint-disable regexp/no-misleading-capturing-group */
/* eslint-disable regexp/no-super-linear-backtracking */
import type { Editor } from '@v-md/core'
import type MarkdownIt from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'
import type { MarkdownEnv } from '../../types'
import { joinPath } from '@v-md/shared'

/**
 * raw path format: "/path/to/file.extension#region {meta} [title]"
 *    where #region, {meta} and [title] are optional
 *    meta can be like '1,2,4-6 lang', 'lang' or '1,2,4-6'
 *    lang can contain special characters like C++, C#, F#, etc.
 *    path can be relative to the current file or absolute
 *    file extension is optional
 *    path can contain spaces and dots
 *
 * captures: ['/path/to/file.extension', 'extension', '#region', '{meta}', '[title]']
 */
export const rawPathRegexp =
  /^(.+?(?:\.([a-z0-9]+))?)(#[\w-]+)?(?: ?\{(\d+(?:[,-]\d+)*)? ?(\S+)? ?(\S+)?\})? ?(?:\[(.+)\])?$/

export function rawPathToToken(rawPath: string) {
  const [
    filepath = '',
    extension = '',
    region = '',
    lines = '',
    lang = '',
    attrs = '',
    rawTitle = '',
  ] = (rawPathRegexp.exec(rawPath) || []).slice(1)

  const title = rawTitle || filepath.split('/').pop() || ''

  return { filepath, extension, region, lines, lang, attrs, title }
}

export function dedent(text: string): string {
  const lines = text.split('\n')

  const minIndentLength = lines.reduce((acc, line) => {
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== ' ' && line[i] !== '\t')
        return Math.min(i, acc)
    }
    return acc
  }, Infinity)

  if (minIndentLength < Infinity) {
    return lines.map(x => x.slice(minIndentLength)).join('\n')
  }

  return text
}

function testLine(
  line: string,
  regexp: RegExp,
  regionName: string,
  end: boolean = false,
) {
  const [full, tag, name] = regexp.exec(line.trim()) || []

  return (
    full &&
    tag &&
    name === regionName &&
    tag.match(end ? /^[Ee]nd ?[rR]egion$/ : /^[rR]egion$/)
  )
}

export function findRegion(lines: Array<string>, regionName: string) {
  const regionRegexps = [
    /^\/\/ ?#?((?:end)?region) ([\w*-]+)$/, // javascript, typescript, java
    /^\/\* ?#((?:end)?region) ([\w*-]+) ?\*\/$/, // css, less, scss
    /^#pragma ((?:end)?region) ([\w*-]+)$/, // C, C++
    /^<!-- #?((?:end)?region) ([\w*-]+) -->$/, // HTML, markdown
    /^#(End Region) ([\w*-]+)$/, // Visual Basic
    /^::#(endregion) ([\w*-]+)$/, // Bat
    /^# ?((?:end)?region) ([\w*-]+)$/, // C#, PHP, Powershell, Python, perl & misc
  ]

  let regexp = null
  let start = -1

  for (const [lineId, line] of lines.entries()) {
    if (regexp === null) {
      for (const reg of regionRegexps) {
        if (testLine(line, reg, regionName)) {
          start = lineId + 1
          regexp = reg
          break
        }
      }
    }
    else if (testLine(line, regexp, regionName, true)) {
      return { start, end: lineId, regexp }
    }
  }

  return null
}

/**
 * 功能：https://vitepress.dev/zh/guide/markdown#import-code-snippets
 *
 * 代码参考：https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/snippet.ts
 */
export function snippetPlugin(md: MarkdownIt, editor: Editor) {
  const { files } = editor

  const parser: RuleBlock = (state, startLine, _endLine, silent) => {
    const CH = '<'.charCodeAt(0)
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) {
      return false
    }

    for (let i = 0; i < 3; ++i) {
      const ch = state.src.charCodeAt(pos + i)
      if (ch !== CH || pos + i >= max) {
        return false
      }
    }

    if (silent) {
      return true
    }

    const start = pos + 3
    const end = state.skipSpacesBack(max, pos)

    const rawPath = state.src
      .slice(start, end)
      .trim()

    const { filepath, extension, region, lines, lang, attrs, title } =
      rawPathToToken(rawPath)

    state.line = startLine + 1

    const token = state.push('fence', 'code', 0)
    token.info = `${lang || extension}${lines ? `{${lines}}` : ''}${
      title ? `[${title}]` : ''
    }  ${attrs ?? ''}`

    const { file } = state.env as MarkdownEnv
    const resolvedPath = joinPath(file.dirPath.value, filepath);

    (token as any).src = [resolvedPath, region.slice(1)]
    token.markup = '```'
    token.map = [startLine, startLine + 1]

    return true
  }

  const fence = md.renderer.rules.fence!

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, , env] = args
    const { includes } = env as MarkdownEnv
    const token = tokens[idx]
    const [src, regionName] = (token as any).src ?? []

    if (!src)
      return fence(...args)

    if (includes) {
      includes.push(src)
    }

    // 此处 src 是绝对路径
    const fileNode = files.root.getNodeByPath(src)
    const isFile = !fileNode?.isFolder.value || false
    if (!fileNode || !isFile) {
      token.content = !fileNode ?
        `Code snippet file path not found: ${src}` :
        `Invalid code snippet option`
      token.info = ''
      return fence(...args)
    }

    let content = fileNode.content.value.replace(/\r\n/g, '\n')

    if (regionName) {
      const lines = content.split('\n')
      const region = findRegion(lines, regionName)

      if (region) {
        content = dedent(
          lines
            .slice(region.start, region.end)
            .filter((line: any) => !region.regexp.test(line.trim()))
            .join('\n'),
        )
      }
    }

    token.content = content
    return fence(...args)
  }

  md.block.ruler.before('fence', 'snippet', parser)
}
