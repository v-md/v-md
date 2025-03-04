import type { Toolbar } from '@v-md/core'
import { DEFAULT_HIGHLIGHT_THEME } from './markdown'

const HIGHLIGHT_THEMES = [
  'light-plus',
  'dark-plus',
]

export function resolveToolbarHighlight(toolbar: Toolbar) {
  const { options } = toolbar.editor

  toolbar.presetMap['highlight-theme'] = {
    type: 'select',
    name: 'highlight-theme',
    icon: import('../assets/highlight.svg').then(m => m.default),
    value: options.markdownOptions.highlightTheme || DEFAULT_HIGHLIGHT_THEME,
    tip: 'markdown 代码高亮主题',
    options: HIGHLIGHT_THEMES.map(item => ({
      label: item,
      value: item,
    })),
    onTrigger(editor, value) {
      editor.options.markdownOptions.highlightTheme = value

      // 重置所有活跃 md 文件的编译状态
      editor.files.preview.relativeFiles.forEach((_v, file) => {
        if (file.ext.value === 'md') {
          file.compiler.reset()
        }
      })

      // 触发重新编译渲染
      editor.files.preview.update()
    },
  }
}
