import type { ToolbarItemOptions } from '@v-md/core'
import { shikiToMonaco } from '@shikijs/monaco'
import { definePlugin } from '@v-md/core'
import { pushOrCreate } from '@v-md/shared'
import { createHighlighter } from 'shiki'

declare module '@v-md/core' {
  interface Monaco {
    /** 编辑器所有高亮主题 */
    highlightThemes?: string[]

    /** 编辑器所有高亮语言。填写 shiki 的语言标识 */
    highlightLanguages?: string[]
  }
}

const THEME_OPTIONS: Required<ToolbarItemOptions>['options'] = [
  { label: 'light-plus', value: 'light-plus' },
  { label: 'dark-plus', value: 'dark-plus' },
]

const THEME_VALUES = THEME_OPTIONS.map(o => o.value)

const DEFAULT_THEME = 'light-plus'

export function editorThemePlugin() {
  return definePlugin({
    name: 'editor-theme',

    onMonacoInit: (monaco) => {
      pushOrCreate(monaco, 'highlightThemes', THEME_VALUES)
      pushOrCreate(monaco, 'highlightLanguages', [])
    },

    onMonacoInitted: async (monaco) => {
      const highlighter = await createHighlighter({
        themes: monaco.highlightThemes || THEME_VALUES,
        langs: monaco.highlightLanguages || [],
      })

      shikiToMonaco(highlighter, monaco.monaco)

      // 若用户没有设置初始主题，设为默认主题
      if (!monaco.editor.options.monacoOptions.theme) {
        monaco.editor.options.monacoOptions.theme = DEFAULT_THEME
      }
    },

    onToolbarInit: (toolbar) => {
      if (toolbar.type !== 'editor') {
        return
      }

      const { editor } = toolbar

      toolbar.presetMap['editor-theme'] = {
        type: 'select',
        name: 'editor-theme',
        icon: import('./theme.svg').then(m => m.default),
        value: editor.options.monacoOptions.theme || DEFAULT_THEME,
        tip: '编辑器主题',
        options: THEME_OPTIONS,
        onTrigger(editor, value) {
          editor.monaco.editorInstance.value?.updateOptions({
            theme: value,
          })
        },
      }
    },
  })
}
