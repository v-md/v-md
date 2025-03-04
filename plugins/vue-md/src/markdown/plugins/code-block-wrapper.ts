/* eslint-disable regexp/optimal-quantifier-concatenation */
/* eslint-disable regexp/no-unused-capturing-group */
import type { Editor } from '@v-md/core'
import { MarkdownItAsync } from '../markdown-it-async'

/**
 * 代码参考：https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/preWrapper.ts
 *
 * 主要用于在 Markdown 文档中渲染代码块时，进行以下行为：
 * - 添加自定义的HTML结构，如复制按钮和语言标签
 * - 提取和格式化代码块的语言信息
 * - 添加 v-pre 指令，默认情况下防止代码块中的内容被 Vue 解析
 */
export function codeBlockWrapperPlugin(md: MarkdownItAsync, editor: Editor) {
  const options = editor.options.markdownOptions
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]

    // remove title from info
    token.info = token.info.replace(/\[.*\]/, '')

    const active = / active( |$)/.test(token.info) ? ' active' : ''
    token.info = token.info.replace(/ active$/, '').replace(/ active /, ' ')

    const lang = extractLang(token.info)

    const rawCode = fence(...args)

    const id = MarkdownItAsync.getPlaceholderId(rawCode)
    if (!id) {
      return rawCode
    }

    const target = md.placeholderMap.get(id)
    if (!target) {
      return rawCode
    }

    target[0] = target[0].then((rawPreCode) => {
      return addClassToPre(rawPreCode, `language-${lang}${active}`).replace(
        /^(<pre[^>]*>)/,
        '$1' +
        `<button title="${options.codeCopyButtonTitle || 'Copy code'}" class="copy"></button>` +
        `<span class="lang">${lang}</span>`,
      )
    })

    return rawCode
  }
}

export function extractTitle(info: string, html = false) {
  if (html) {
    return (
      info.replace(/<!--[\s\S]*?-->/g, '').match(/data-title="(.*?)"/)?.[1] || ''
    )
  }
  return info.match(/\[(.*)\]/)?.[1] || extractLang(info) || 'txt'
}

export function extractLang(info: string) {
  return info
    .trim()
    .replace(/=(\d*)/, '')
    .replace(/:(no-)?line-numbers(\{| |$|=\d*).*/, '')
    .replace(/(-vue|\{| ).*$/, '')
    .replace(/^vue-html$/, 'template')
    .replace(/^ansi$/, '')
}

export function addClassToPre(html: string, classToAdd: string) {
  const preClassReg = /^<pre[^>]*class="([^'"]+)"[^>]*>/
  let [, classNames] = html.match(preClassReg) || []
  classNames += ` ${classToAdd}`

  const preStartReg = /^(<pre[^>]*>)/
  let [, preStartBracket] = html.match(preStartReg) || []
  preStartBracket = preStartBracket.replace(/class="[^'"]+"/, `class="${classNames}"`)

  return html.replace(preStartReg, preStartBracket)
}
