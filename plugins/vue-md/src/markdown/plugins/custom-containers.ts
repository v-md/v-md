import type { Editor } from '@v-md/core'
import type MarkdownIt from 'markdown-it'
import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type Token from 'markdown-it/lib/token.mjs'
import type { MarkdownEnv } from '../../types'
import container from 'markdown-it-container'

export interface CustomContainerOptions {
  infoLabel?: string
  noteLabel?: string
  tipLabel?: string
  warningLabel?: string
  dangerLabel?: string
  detailsLabel?: string
  importantLabel?: string
  cautionLabel?: string
}

type ContainerArgs = [typeof container, string, { render: RenderRule }]

/**
 * 自定义容器功能。
 *
 * 说明：https://vitepress.dev/zh/guide/markdown#custom-containers
 *
 * 代码参考：https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/containers.ts
 */
export function customContainersPlugin(md: MarkdownIt, editor: Editor) {
  const containerOptions = editor.options.markdownOptions.container
  const {
    tipLabel = 'TIP',
    infoLabel = 'INFO',
    warningLabel = 'WARNING',
    dangerLabel = 'DANGER',
    detailsLabel = 'Details',
  } = containerOptions || {}

  md.use(...createContainer('tip', tipLabel, md))
    .use(...createContainer('info', infoLabel, md))
    .use(...createContainer('warning', warningLabel, md))
    .use(...createContainer('danger', dangerLabel, md))
    .use(...createContainer('details', detailsLabel, md))
    // explicitly escape Vue syntax
    .use(container, 'v-pre', {
      render: (tokens: Token[], idx: number) =>
        tokens[idx].nesting === 1 ? `<div v-pre>\n` : `</div>\n`,
    })
    .use(container, 'raw', {
      render: (tokens: Token[], idx: number) =>
        tokens[idx].nesting === 1 ? `<div class="vp-raw">\n` : `</div>\n`,
    })
}

function createContainer(
  klass: string,
  defaultTitle: string,
  md: MarkdownIt,
): ContainerArgs {
  return [
    container,
    klass,
    {
      render(tokens, idx, _options, env: MarkdownEnv & { references?: any }) {
        const token = tokens[idx]
        const info = token.info.trim().slice(klass.length).trim()
        const attrs = md.renderer.renderAttrs(token)
        if (token.nesting === 1) {
          const title = md.renderInline(info || defaultTitle, {
            references: env.references,
          })
          if (klass === 'details')
            return `<details class="${klass} custom-block"${attrs}><summary>${title}</summary>\n`
          return `<div class="${klass} custom-block"${attrs}><p class="custom-block-title">${title}</p>\n`
        }
        else {
          return klass === 'details' ? `</details>\n` : `</div>\n`
        }
      },
    },
  ]
}
