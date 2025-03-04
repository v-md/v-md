import type { EditorVolarOptions } from './types'
import { definePlugin } from '@v-md/core'
import { pushOrCreate } from '@v-md/shared'
import {
  DEFAULT_VOLAR_LANGUAGES,
  initMonacoEnv,
  initMonacoLang,
} from './monaco'

export function editorVolarPlugin(options: EditorVolarOptions) {
  return definePlugin({
    name: 'editor-volar',

    onOptionsDefault: (editor) => {
      editor.options.vueVersion = 'latest'
      editor.options.tsVersion = 'latest'
    },

    onDestroy: (editor) => {
      editor.monaco.disposeVolar?.()
    },

    onMonacoInit: (monaco) => {
      pushOrCreate(monaco, 'volarLangIds', DEFAULT_VOLAR_LANGUAGES)

      initMonacoEnv(monaco, options)
    },

    onMonacoInitted(monaco) {
      initMonacoLang(monaco)
    },
  })
}

export * from './types'
