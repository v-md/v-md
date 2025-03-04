import type { Editor } from '@v-md/core'
import type MarkdownIt from 'markdown-it'
import type { PluginWithParams } from 'markdown-it'

export function mathPlugin(md: MarkdownIt, editor: Editor, mathjaxPlugin: PluginWithParams) {
  const options = editor.options.markdownOptions
  md.use(mathjaxPlugin, {
    ...(typeof options.math === 'boolean' ? {} : options.math),
  })
  const orig = md.renderer.rules.math_block!
  md.renderer.rules.math_block = (tokens, idx, options, env, self) => {
    return orig(tokens, idx, options, env, self).replace(
      /^<mjx-container /,
      '<mjx-container tabindex="0" ',
    )
  }
}
