import type { Editor } from '@v-md/core'
import { componentPlugin } from '@mdit-vue/plugin-component'
import { frontmatterPlugin } from '@mdit-vue/plugin-frontmatter'
import { headersPlugin } from '@mdit-vue/plugin-headers'
import { sfcPlugin } from '@mdit-vue/plugin-sfc'
import { titlePlugin } from '@mdit-vue/plugin-title'
import { tocPlugin } from '@mdit-vue/plugin-toc'
import { slugify } from '@mdit-vue/shared'
import anchorPlugin from 'markdown-it-anchor'
import attrsPlugin from 'markdown-it-attrs'
import { full as emojiPlugin } from 'markdown-it-emoji'
import { createMarkdownItAsync } from './markdown-it-async'
import {
  codeBlockWrapperPlugin,
  codeGroupPlugin,
  customContainersPlugin,
  gitHubAlertsPlugin,
  highlightLinePlugin,
  imagePlugin,
  lineNumbersPlugin,
  mathPlugin,
  restoreEntitiesPlugin,
  snippetPlugin,
  vueSfcRenderPost,
} from './plugins'

export async function createMarkdownRenderer(editor: Editor) {
  const options = editor.options.markdownOptions

  const markdownIt = createMarkdownItAsync({
    html: true,
    linkify: true,
    ...options,
  })

  if (options.configOverride) {
    await options.configOverride(markdownIt)
    return markdownIt
  }

  markdownIt.linkify.set({ fuzzyLink: false })
  markdownIt.renderer.rules.table_open = function () {
    return '<table tabindex="0">\n'
  }

  markdownIt.register({
    registerName: 'restore-entities',
    plugin: restoreEntitiesPlugin,
    params: [],
  })

  markdownIt.register({
    registerName: 'vue-component',
    plugin: componentPlugin,
    params: [{ ...options.component }],
  })

  markdownIt.register({
    registerName: 'highlight-line',
    plugin: highlightLinePlugin,
  })

  markdownIt.register({
    registerName: 'code-block-wrapper',
    plugin: codeBlockWrapperPlugin,
    params: [editor],
  })

  markdownIt.register({
    registerName: 'snippet',
    plugin: snippetPlugin,
    params: [editor],
  })

  markdownIt.register({
    registerName: 'custom-containers',
    plugin: customContainersPlugin,
    params: [editor],
  })

  markdownIt.register({
    registerName: 'code-group',
    plugin: codeGroupPlugin,
  })

  markdownIt.register({
    registerName: 'image',
    plugin: imagePlugin,
    params: [editor],
  })

  markdownIt.register({
    registerName: 'line-numbers',
    plugin: lineNumbersPlugin,
    params: [editor],
  })

  if (options.gfmAlerts !== false) {
    markdownIt.register({
      registerName: 'github-alerts',
      plugin: gitHubAlertsPlugin,
      params: [editor],
    })
  }

  if (!options.attrs?.disable) {
    markdownIt.register({
      registerName: 'attrs',
      plugin: attrsPlugin,
      params: [{ ...options.attrs }],
    })
  }

  markdownIt.register({
    registerName: 'emoji',
    plugin: emojiPlugin,
    params: [{ ...options.emoji }],
  })

  markdownIt.register({
    registerName: 'anchor',
    plugin: anchorPlugin,
    params: [{
      slugify,
      permalink: anchorPlugin.permalink.linkInsideHeader({
        symbol: '&ZeroWidthSpace;',
        renderAttrs: (slug, state) => {
          // Find `heading_open` with the id identical to slug
          const idx = state.tokens.findIndex((token) => {
            const attrs = token.attrs
            const id = attrs?.find(attr => attr[0] === 'id')
            return id && slug === id[1]
          })
          // Get the actual heading content
          const title = state.tokens[idx + 1].content
          return {
            'aria-label': `Permalink to "${title}"`,
          }
        },
      }),
      ...options.anchor,
    } as anchorPlugin.AnchorOptions],
  })

  markdownIt.register({
    registerName: 'vue-frontmatter',
    plugin: frontmatterPlugin,
    params: [{ ...options.frontmatter }],
  })

  if (options.headers) {
    markdownIt.register({
      registerName: 'vue-headers',
      plugin: headersPlugin,
      params: [{ ...(typeof options.headers === 'boolean' ? {} : options.headers) }],
    })
  }

  markdownIt.register({
    registerName: 'vue-sfc',
    plugin: sfcPlugin,
    params: [{ ...options.sfc }],
    renderPost: vueSfcRenderPost,
  })

  markdownIt.register({
    registerName: 'vue-title',
    plugin: titlePlugin,
  })

  markdownIt.register({
    registerName: 'vue-toc',
    plugin: tocPlugin,
    params: [{ ...options.toc }],
  })

  if (options.math) {
    const mathjaxPlugin = await import('markdown-it-mathjax3')
    markdownIt.register({
      registerName: 'math',
      plugin: mathPlugin,
      params: [editor, mathjaxPlugin],
    })
  }

  if (options.config) {
    await options.config(markdownIt)
  }

  return markdownIt
}
