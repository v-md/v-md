import type MarkdownIt from 'markdown-it'
import { nanoid } from '@v-md/shared'
import container from 'markdown-it-container'
import { extractTitle } from './code-block-wrapper'

/**
 * 说明：https://vitepress.dev/zh/guide/markdown#code-groups
 *
 * 代码参考：https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/containers.ts
 */
export function codeGroupPlugin(md: MarkdownIt) {
  md.use(container, 'code-group', {
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        const name = nanoid(5)
        let tabs = ''
        let checked = 'checked'

        for (
          let i = idx + 1;
          !(
            tokens[i].nesting === -1 &&
            tokens[i].type === 'container_code-group_close'
          );
          ++i
        ) {
          const isHtml = tokens[i].type === 'html_block'

          if (
            (tokens[i].type === 'fence' && tokens[i].tag === 'code') ||
            isHtml
          ) {
            const title = extractTitle(
              isHtml ? tokens[i].content : tokens[i].info,
              isHtml,
            )

            if (title) {
              const id = nanoid(7)
              tabs += `<input type="radio" name="group-${name}" id="tab-${id}" ${checked}><label for="tab-${id}">${title}</label>`

              if (checked && !isHtml)
                tokens[i].info += ' active'
              checked = ''
            }
          }
        }

        return `<div vmd-code-group><div class="tabs">${tabs}</div><div class="blocks">\n`
      }
      return `</div></div>\n`
    },
  } as container.ContainerOpts)
}
