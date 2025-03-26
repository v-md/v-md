import { definePlugin } from '@v-md/core'
import { parseJson, pushOrCreate } from '@v-md/shared'

export function langJsonPlugin() {
  return definePlugin({
    name: 'lang-json',

    onMonacoInit: (editorMonaco) => {
      const { monaco } = editorMonaco

      pushOrCreate(editorMonaco, 'highlightLanguages', ['json'])

      monaco.languages.register({ id: 'json', extensions: ['.json'] })
    },

    onFilesInit: (files) => {
      files.fileExtMap.json = {
        icon: import('./json.svg').then(m => m.default),
        iconColor: '',
        lang: 'json',
        mime: 'text/json',
      }
    },

    onFileCompile: (_compiler, result, lang, code) => {
      if (lang !== 'json') {
        return
      }

      const json = parseJson(code)
      result.js = `export default ${JSON.stringify(json)}`
    },
  })
}
