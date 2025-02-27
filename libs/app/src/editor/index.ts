import type { EditorOptions } from '@v-md/core'
import { Editor } from '@v-md/core'
import { editorThemePlugin } from '@v-md/plugin-editor-theme'
import { filesBasicPlugin } from '@v-md/plugin-files-basic'
import { langCssPlugin } from '@v-md/plugin-lang-css'
import { langJsPlugin } from '@v-md/plugin-lang-js'
import { langJsonPlugin } from '@v-md/plugin-lang-json'
import { langTsPlugin } from '@v-md/plugin-lang-ts'
import { langVuePlugin } from '@v-md/plugin-lang-vue'
import { langVueJsxPlugin } from '@v-md/plugin-lang-vue-jsx'
import { themePlugin } from '@v-md/plugin-theme'
import { toolbarBasicPlugin } from '@v-md/plugin-toolbar-basic'
import { vueMdPlugin } from '@v-md/plugin-vue-md'

export function createEditor(options?: EditorOptions) {
  return Editor.init({
    ...options,
    plugins: (editor) => {
      editor.use(filesBasicPlugin())
        .use(toolbarBasicPlugin())
        .use(editorThemePlugin())
        .use(langCssPlugin())
        .use(langJsonPlugin())
        .use(langJsPlugin())
        .use(langTsPlugin())
        .use(langVuePlugin())
        .use(langVueJsxPlugin())
        .use(vueMdPlugin())
        .use(themePlugin())

      options?.plugins?.(editor)
    },
  })
}
