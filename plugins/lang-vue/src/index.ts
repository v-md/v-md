import type {
  SFCAsyncStyleCompileOptions,
  SFCScriptCompileOptions,
  SFCTemplateCompileOptions,
} from 'vue/compiler-sfc'
import { definePlugin } from '@v-md/core'
import { pushOrCreate } from '@v-md/shared'
import { compileVue } from './compile'
import { vue } from './lang-configs'

declare module '@v-md/core' {
  interface FileManager {
    /** Vue SFC Styles 样式支持的语言列表，未来支持 CSS 预处理器的拓展 */
    sfcStyleSupportLangs?: string[]
  }

  interface EditorOptions {
    /** vue sfc 编译选项 */
    sfcOptions?: {
      script?: Partial<SFCScriptCompileOptions>
      style?: Partial<SFCAsyncStyleCompileOptions>
      template?: Partial<SFCTemplateCompileOptions>
    }
  }
}

export function langVuePlugin() {
  return definePlugin({
    name: 'lang-vue',

    onOptionsDefault: (editor) => {
      editor.options.sfcOptions = {}
    },

    onMonacoInit: (editorMonaco) => {
      const { monaco } = editorMonaco

      pushOrCreate(editorMonaco, 'highlightLanguages', ['vue'])

      monaco.languages.register({ id: 'vue', extensions: ['.vue'] })
      monaco.languages.setLanguageConfiguration('vue', vue as any)
    },

    onFilesInit: (files) => {
      files.fileExtToLang.vue = 'vue'
      files.fileExtToIcon.vue = {
        icon: import('./vuejs.svg').then(m => m.default),
        color: '',
      }

      pushOrCreate(files, 'sfcStyleSupportLangs', ['css'])
    },

    onFileCompile: async (compiler, result, lang, code) => {
      if (lang !== 'vue') {
        return
      }

      await compileVue(compiler, result, code)
    },
  })
}

export * from './compile'
