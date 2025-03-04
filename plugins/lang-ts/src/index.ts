import { definePlugin } from '@v-md/core'
import { pushOrCreate } from '@v-md/shared'
import { ts } from './lang-configs'

export function langTsPlugin() {
  return definePlugin({
    name: 'lang-ts',

    onMonacoInit: (editorMonaco) => {
      const { monaco } = editorMonaco

      pushOrCreate(editorMonaco, 'highlightLanguages', ['tsx'])

      monaco.languages.register({ id: 'typescript', extensions: ['.ts', '.tsx'] })
      monaco.languages.setLanguageConfiguration('typescript', ts as any)
    },

    onFilesInit: (files) => {
      files.fileExtToLang.ts = 'typescript'
      files.fileExtToLang.tsx = 'typescript'

      files.fileExtToIcon.ts = {
        icon: import('./typescript.svg').then(m => m.default),
        color: '',
      }
      files.fileExtToIcon.tsx = {
        icon: import('./typescript.svg').then(m => m.default),
        color: '',
      }
    },

    onFileCompile: async (compiler, result, lang, code) => {
      if (lang !== 'tsx' && lang !== 'ts') {
        return
      }

      const isTsx = lang === 'tsx'
      const { editor } = compiler
      const jsCode = await import('./transform-ts').then(m => m.transformTs(code, isTsx))

      if (isTsx) {
        await editor.emit('onFileCompile', compiler, result, 'jsx', jsCode)
      }
      else {
        result.js = jsCode
      }
    },
  })
}
