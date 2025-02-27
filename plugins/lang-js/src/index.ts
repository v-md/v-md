import { definePlugin } from '@v-md/core'
import { pushOrCreate } from '@v-md/shared'
import { js } from './lang-configs'

export function langJsPlugin() {
  return definePlugin({
    name: 'lang-js',

    onMonacoInit: (editorMonaco) => {
      const { monaco } = editorMonaco

      pushOrCreate(editorMonaco, 'highlightLanguages', ['jsx'])

      monaco.languages.register({ id: 'javascript', extensions: ['.js', '.jsx'] })
      monaco.languages.setLanguageConfiguration('javascript', js as any)
    },

    onFilesInit: (files) => {
      files.fileExtToLang.js = 'javascript'
      files.fileExtToLang.jsx = 'javascript'

      files.fileExtToIcon.js = {
        icon: import('./javascript.svg').then(m => m.default),
        color: '',
      }
      files.fileExtToIcon.jsx = {
        icon: import('./javascript.svg').then(m => m.default),
        color: '',
      }
    },

    onFileCompile: async (_compiler, result, lang, code) => {
      if (lang !== 'js') {
        return
      }

      result.js = code
    },
  })
}
