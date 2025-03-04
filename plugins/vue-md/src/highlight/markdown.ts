/* eslint-disable regexp/no-super-linear-backtracking */
/* eslint-disable regexp/optimal-quantifier-concatenation */
/* eslint-disable regexp/no-unused-capturing-group */
import type {
  TransformerCompactLineOption,
} from '@shikijs/transformers'
import type { Editor } from '@v-md/core'
import type { ShikiTransformer } from 'shiki'
import {
  transformerCompactLineOptions,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers'
import { customAlphabet } from '@v-md/shared'
import {
  bundledLanguages,
  bundledThemes,
  createHighlighter,
  isSpecialLang,
} from 'shiki'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

const DEFAULT_HIGHLIGHT_LANG = 'txt'
export const DEFAULT_HIGHLIGHT_THEME = 'light-plus'
/**
 * 2 steps:
 *
 * 1. convert attrs into line numbers:
 *    {4,7-13,16,23-27,40} -> [4,7,8,9,10,11,12,13,16,23,24,25,26,27,40]
 * 2. convert line numbers into line options:
 *    [{ line: number, classes: string[] }]
 */
function attrsToLines(attrs: string): TransformerCompactLineOption[] {
  attrs = attrs.replace(/^(?:\[.*?\])?.*?([\d,-]+).*/, '$1').trim()
  const result: number[] = []
  if (!attrs) {
    return []
  }
  attrs
    .split(',')
    .map(v => v.split('-').map(v => Number.parseInt(v, 10)))
    .forEach(([start, end]) => {
      if (start && end) {
        result.push(
          ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
        )
      }
      else {
        result.push(start)
      }
    })
  return result.map(v => ({
    line: v,
    classes: ['highlighted'],
  }))
}

export type HighlightHandler = (str: string, lang: string, attrs: string) => Promise<string>
export type HighlightDispose = () => void

/**
 * 代码高亮
 *
 * 参考：https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/highlight.ts
 */
export async function highlight(editor: Editor): Promise<[HighlightHandler, HighlightDispose]> {
  const options = editor.options.markdownOptions

  const highlighter = await createHighlighter({
    themes: [],
    langs: [],
    langAlias: options.languageAlias,
  })

  await options?.shikiSetup?.(highlighter)

  const transformers: ShikiTransformer[] = [
    transformerNotationDiff(),
    transformerNotationFocus({
      classActiveLine: 'has-focus',
      classActivePre: 'has-focused-lines',
    }),
    transformerNotationHighlight(),
    transformerNotationErrorLevel(),
  ]

  const vueRE = /-vue$/
  const lineNoStartRE = /=(\d*)/
  const lineNoRE = /:(no-)?line-numbers(=\d*)?$/
  const mustacheRE = /\{\{.*?\}\}/g

  return [async (str: string, lang: string, attrs: string) => {
    const {
      codeTransformers: userTransformers = [],
    } = options

    let {
      highlightTheme = DEFAULT_HIGHLIGHT_THEME,
    } = options

    const vPre = vueRE.test(lang) ? '' : 'v-pre'
    lang =
      lang
        .replace(lineNoStartRE, '')
        .replace(lineNoRE, '')
        .replace(vueRE, '')
        .toLowerCase() || DEFAULT_HIGHLIGHT_LANG

    const langLoader = bundledLanguages[lang as keyof typeof bundledLanguages]
    if (!langLoader && !isSpecialLang(lang)) {
      editor.logger.warn(`\nThe language '${lang}' is not loaded, falling back to ${DEFAULT_HIGHLIGHT_LANG} for syntax highlighting.`)
      lang = DEFAULT_HIGHLIGHT_LANG
    }

    if (!highlighter.getLoadedLanguages().includes(lang)) {
      await highlighter.loadLanguage(lang as keyof typeof bundledLanguages)
    }

    const themeLoader = bundledThemes[highlightTheme as keyof typeof bundledThemes]
    if (!themeLoader) {
      editor.logger.warn(`\nThe theme '${DEFAULT_HIGHLIGHT_THEME}' is not loaded, falling back to 'light-plus' for syntax highlighting.`)
      highlightTheme = DEFAULT_HIGHLIGHT_THEME
    }

    if (!highlighter.getLoadedThemes().includes(highlightTheme)) {
      await highlighter.loadTheme(highlightTheme as keyof typeof bundledThemes)
    }

    const lineOptions = attrsToLines(attrs)
    const mustaches = new Map<string, string>()

    const removeMustache = (s: string) => {
      if (vPre)
        return s
      return s.replace(mustacheRE, (match) => {
        let marker = mustaches.get(match)
        if (!marker) {
          marker = nanoid()
          mustaches.set(match, marker)
        }
        return marker
      })
    }

    const restoreMustache = (s: string) => {
      mustaches.forEach((marker, match) => {
        s = s.replaceAll(marker, match)
      })
      return s
    }

    str = removeMustache(str).trimEnd()

    const highlighted = highlighter.codeToHtml(str, {
      lang,
      transformers: [
        ...transformers,
        transformerCompactLineOptions(lineOptions),
        {
          name: 'vitepress:v-pre',
          pre(node) {
            if (vPre)
              node.properties['v-pre'] = ''
          },
        },
        {
          name: 'vitepress:empty-line',
          code(hast) {
            hast.children.forEach((span) => {
              if (
                span.type === 'element' &&
                span.tagName === 'span' &&
                Array.isArray(span.properties.class) &&
                span.properties.class.includes('line') &&
                span.children.length === 0
              ) {
                span.children.push({
                  type: 'element',
                  tagName: 'wbr',
                  properties: {},
                  children: [],
                })
              }
            })
          },
        },
        ...userTransformers,
      ],
      meta: { __raw: attrs },
      themes: {
        highlight: highlightTheme,
      },
      defaultColor: false,
    })

    return restoreMustache(highlighted)
  }, highlighter.dispose]
}
