import { definePlugin } from '@v-md/core'
import { pushOrCreate } from '@v-md/shared'
import { css } from './lang-configs'

export function langCssPlugin() {
  return definePlugin({
    name: 'lang-css',

    onMonacoInit: (editorMonaco) => {
      const { monaco } = editorMonaco

      pushOrCreate(editorMonaco, 'highlightLanguages', ['css'])
      monaco.languages.register({ id: 'css', extensions: ['.css'] })
      monaco.languages.setLanguageConfiguration('css', css)
    },

    onFilesInit: (files) => {
      files.fileExtToLang.css = 'css'
      files.fileExtToIcon.css = {
        icon: import('./css.svg').then(m => m.default),
        color: '',
      }
    },

    onFileCompile: (_compiler, result, lang, code) => {
      if (lang !== 'css') {
        return
      }

      result.css = code
    },
  })
}
