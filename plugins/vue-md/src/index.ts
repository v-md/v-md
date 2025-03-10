import type {
  HighlightDispose,
  HighlightHandler,
} from './highlight'
import { definePlugin } from '@v-md/core'
import { pushOrCreate, setOrCreate } from '@v-md/shared'
import { compileVueMd } from './compile'
import {
  highlight as createHighlighter,
  resolveToolbarHighlight,
} from './highlight'
import { md } from './lang-configs'
import { createMarkdownRenderer } from './markdown'

/** 额外添加基础样式、交互逻辑的 key */
export const VUE_MD_BASE_KEY = 'vue-md-base'

/** 添加高亮基础样式的 key */
export const HIGHLIGHT_BASE_KEY = 'vue-md-highlight'

export function vueMdPlugin() {
  let disposeHighlight: HighlightDispose | null = null
  let highlight: HighlightHandler | null = null

  return definePlugin({
    name: 'vue-md',

    onOptionsDefault: (editor) => {
      editor.options.markdownOptions = {}
    },

    onOptionsResolved: async (editor) => {
      if (editor.options.markdownOptions?.highlight) {
        return
      }

      [highlight, disposeHighlight] = await createHighlighter(editor)
      setOrCreate(editor.options, 'markdownOptions', 'highlight', highlight)
    },

    onDestroy: () => {
      disposeHighlight?.()
    },

    onMonacoInit: (editorMonaco) => {
      const { monaco } = editorMonaco

      pushOrCreate(editorMonaco, 'highlightLanguages', ['markdown'])
      pushOrCreate(editorMonaco, 'volarLangIds', ['markdown'])

      monaco.languages.register({ id: 'markdown', extensions: ['.md'] })
      monaco.languages.setLanguageConfiguration('markdown', md as any)
    },

    onFilesInit: async (files) => {
      files.fileExtToLang.md = 'markdown'
      files.fileExtToIcon.md = {
        icon: import('./assets/markdown.svg').then(m => m.default),
        color: '',
      }

      // markdown 渲染器初始化
      files.markdownIt = await createMarkdownRenderer(files.editor)
    },

    onFilesInitted: async (files) => {
      if (!files.markdownIt) {
        return
      }

      files.markdownIt.initRegisterdPlugins()

      const mainFile = files.keyFiles.main
      if (!mainFile) {
        return
      }

      const { options } = files.editor
      const {
        baseScripts = true,
        baseStyles = true,
      } = options.markdownOptions || {}

      if (baseStyles) {
        mainFile.compiler.cssExtra.set(
          VUE_MD_BASE_KEY,
          import(`./markdown/style.css?raw`).then(m => m.default),
        )
      }
      if (baseScripts) {
        mainFile.compiler.jsExtra.set(
          VUE_MD_BASE_KEY,
          import(`./markdown/script.js?raw`).then(m => m.default),
        )
      }

      // 为编译入口文件添加高亮样式的额外代码
      mainFile.compiler.cssExtra.set(
        HIGHLIGHT_BASE_KEY,
        import(`./highlight/highlight.css?raw`).then(m => m.default),
      )
    },

    onFileCompile: async (compiler, result, lang, code) => {
      if (lang !== 'md') {
        return
      }

      await compileVueMd(compiler, result, code)
    },

    onToolbarInit: (toolbar) => {
      if (toolbar.type !== 'editor') {
        return
      }

      resolveToolbarHighlight(toolbar)
    },
  })
}

export * from './compile'
export * from './markdown/markdown-it-async'
export * from './markdown/plugins'
export * from './types'
