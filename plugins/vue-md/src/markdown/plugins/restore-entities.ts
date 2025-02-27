import type MarkdownIt from 'markdown-it'
import type StateCore from 'markdown-it/lib/rules_core/state_core.mjs'
import type Token from 'markdown-it/lib/token.mjs'

function escapeHtml(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/&(?![\w#]+;)/g, '&amp;')
}

/**
 * 代码参考：https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/restoreEntities.ts
 *
 * 这个插件的用途是在 Markdown 文本解析过程中，确保文本内容被正确地转义和恢复，以避免在 HTML 渲染时出现安全问题或显示错误。
 * 这对于在 Web 应用中安全地显示用户输入的 Markdown 文本非常有用
 */
export function restoreEntitiesPlugin(md: MarkdownIt): void {
  md.core.ruler.at('text_join', text_join)
  md.renderer.rules.text = (tokens, idx) => escapeHtml(tokens[idx].content)
}

function text_join(state: StateCore): void {
  let curr, last
  const blockTokens = state.tokens
  const l = blockTokens.length

  for (let j = 0; j < l; ++j) {
    if (blockTokens[j].type !== 'inline')
      continue

    const tokens = blockTokens[j].children || []
    const max = tokens.length

    for (curr = 0; curr < max; ++curr) {
      if (tokens[curr].type === 'text_special')
        tokens[curr].type = 'text'
    }

    for (curr = last = 0; curr < max; ++curr) {
      if (
        tokens[curr].type === 'text' &&
        curr + 1 < max &&
        tokens[curr + 1].type === 'text'
      ) {
        tokens[curr + 1].content =
          getContent(tokens[curr]) + getContent(tokens[curr + 1])
        tokens[curr + 1].info = ''
        tokens[curr + 1].markup = ''
      }
      else {
        if (curr !== last)
          tokens[last] = tokens[curr]
        ++last
      }
    }

    if (curr !== last)
      tokens.length = last
  }
}

function getContent(token: Token): string {
  return token.info === 'entity' ?
    token.markup :
    token.info === 'escape' && token.content === '&' ?
      '&amp;' :
      token.content
}
