/* eslint-disable regexp/no-unused-capturing-group */
import type { Editor } from '@v-md/core'
import { MarkdownItAsync } from '../markdown-it-async'
import { addClassToPre } from './code-block-wrapper'

export function lineNumbersPlugin(md: MarkdownItAsync, editor: Editor) {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const { lineNumbers = false } = editor.options.markdownOptions || {}

    const rawCode = fence(...args)

    const id = MarkdownItAsync.getPlaceholderId(rawCode)
    if (!id) {
      return rawCode
    }

    const target = md.placeholderMap.get(id)
    if (!target) {
      return rawCode
    }

    const [tokens, idx] = args
    const info = tokens[idx].info
    const disabled = (!lineNumbers && !/:line-numbers($| |=)/.test(info)) ||
      /:no-line-numbers($| )/.test(info)
    target[0] = target[0].then((rawPreCode) => {
      if (disabled) {
        return rawPreCode
      }

      let startLineNumber = 1
      const matchStartLineNumber = info.match(/=(\d*)/)
      if (matchStartLineNumber && matchStartLineNumber[1]) {
        startLineNumber = Number.parseInt(matchStartLineNumber[1])
      }

      const code = rawPreCode.slice(
        rawPreCode.indexOf('<code>'),
        rawPreCode.indexOf('</code>'),
      )
      const lines = code.split('\n')

      const lineNumbersCode = [...Array.from({ length: lines.length })]
        .map(
          (_, index) =>
            `<span class="line-number">${index + startLineNumber}</span><br>`,
        )
        .join('')

      const lineNumbersWrapperCode = `<div class="line-numbers-wrapper" aria-hidden="true">${lineNumbersCode}</div>`

      return addClassToPre(rawPreCode, 'line-numbers-mode')
        .replace(/(<\/pre>)$/, `${lineNumbersWrapperCode}$1`)
    })

    return rawCode
  }
}
