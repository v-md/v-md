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
import { staticAssetsPlugin } from '@v-md/plugin-static-assets-basic'
import { themePlugin } from '@v-md/plugin-theme'
import { toolbarBasicPlugin } from '@v-md/plugin-toolbar-basic'
import { vueMdPlugin } from '@v-md/plugin-vue-md'

// 补充空的类型导出，避免 vite-plugin-dts 忽略其他插件的类型导入，导致 EditorOptions 接口未被拓展
export type {} from '@v-md/plugin-editor-theme'
export type {} from '@v-md/plugin-files-basic'
export type {} from '@v-md/plugin-lang-css'
export type {} from '@v-md/plugin-lang-js'
export type {} from '@v-md/plugin-lang-json'
export type {} from '@v-md/plugin-lang-ts'
export type {} from '@v-md/plugin-lang-vue'
export type {} from '@v-md/plugin-lang-vue-jsx'
export type {} from '@v-md/plugin-static-assets-basic'
export type {} from '@v-md/plugin-theme'
export type {} from '@v-md/plugin-toolbar-basic'
export type {} from '@v-md/plugin-vue-md'

export function createEditor(options?: EditorOptions) {
  return Editor.init({
    ...options,
    plugins: (editor) => {
      editor.use(filesBasicPlugin())
        .use(toolbarBasicPlugin())
        .use(editorThemePlugin())
        .use(staticAssetsPlugin())
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
