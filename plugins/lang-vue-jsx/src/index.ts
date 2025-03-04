import { definePlugin } from '@v-md/core'

export function langVueJsxPlugin() {
  return definePlugin({
    name: 'lang-vue-jsx',

    onFileCompile: async (_compiler, result, lang, code) => {
      if (lang !== 'jsx') {
        return
      }

      result.js = await import('./transform-jsx').then(m => m.transformJsx(code))
    },
  })
}
