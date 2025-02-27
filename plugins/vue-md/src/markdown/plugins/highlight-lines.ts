// Modified from https://github.com/egoist/markdown-it-highlight-lines
// Now this plugin is only used to normalize line attrs.
// The else part of line highlights logic is in './highlight.ts'.

import type MarkdownIt from 'markdown-it'

const RE = /\{([\d,-]+)\}/

/**
 * 代码参考：https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/highlightLines.ts
 *
 * 该插件的主要用途是在渲染 Markdown 文档时，将高亮的行号信息规范化，并加入到代码块的 token 中。
 * 这样，后续的插件（如高亮插件）可以根据这些信息来高亮指定的行
 */
export function highlightLinePlugin(md: MarkdownIt) {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]

    // due to use of markdown-it-attrs, the {0} syntax would have been
    // converted to attrs on the token
    const attr = token.attrs && token.attrs[0]

    let lines = null

    if (!attr) {
      // markdown-it-attrs maybe disabled
      const rawInfo = token.info

      if (!rawInfo || !RE.test(rawInfo)) {
        return fence(...args)
      }

      const langName = rawInfo.replace(RE, '').trim()

      // ensure the next plugin get the correct lang
      token.info = langName

      lines = RE.exec(rawInfo)![1]
    }

    if (!lines) {
      lines = attr![0]

      if (!lines || !/[\d,-]+/.test(lines)) {
        return fence(...args)
      }
    }

    token.info += ` ${lines}`
    return fence(...args)
  }
}
