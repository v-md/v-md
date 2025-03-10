import type { Editor } from '@v-md/core'
import type MarkdownIt from 'markdown-it'

export interface ImageOptions {
  /**
   * Support native lazy loading for the `<img>` tag.
   * @default false
   */
  lazyLoading?: boolean
}

const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i

/** markdown-it plugin for normalizing image source */
export function imagePlugin(md: MarkdownIt, editor: Editor) {
  const imageRule = md.renderer.rules.image!
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const { lazyLoading = false } = editor.options.markdownOptions?.image || {}
    const token = tokens[idx]
    let url = token.attrGet('src')
    if (url && !EXTERNAL_URL_RE.test(url)) {
      if (!/^\.?\//.test(url))
        url = `./${url}`
      token.attrSet('src', decodeURIComponent(url))
    }
    if (lazyLoading) {
      token.attrSet('loading', 'lazy')
    }
    return imageRule(tokens, idx, options, env, self)
  }
}
