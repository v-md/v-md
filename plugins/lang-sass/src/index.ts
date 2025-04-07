import { definePlugin } from '@v-md/core'
import { pushOrCreate } from '@v-md/shared'
import { compileSass } from './compile'
import { sass } from './lang-configs'

export function langSassPlugin() {
  return definePlugin({
    name: 'lang-sass',

    onMonacoInit: (editorMonaco) => {
      const { monaco } = editorMonaco
      pushOrCreate(editorMonaco, 'highlightLanguages', ['sass'])
      monaco.languages.register({ id: 'sass', extensions: ['.sass', '.scss'] })
      monaco.languages.setLanguageConfiguration('sass', sass as any)
    },

    onFilesInit: (files) => {
      files.fileExtMap.sass = {
        icon: import('./sass.svg').then(m => m.default),
        iconColor: '',
        lang: 'sass',
        mime: 'text/css',
      }
      files.fileExtMap.scss = {
        icon: import('./sass.svg').then(m => m.default),
        iconColor: '',
        lang: 'sass',
        mime: 'text/css',
      }
    },

    onFileCompile: async (compiler, result, lang, code) => {
      if (lang !== 'sass' && lang !== 'scss') {
        return
      }

      await compileSass(compiler, result, code)
    },
  })
}
