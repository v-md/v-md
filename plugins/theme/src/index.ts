import type { FileNode } from '@v-md/core'
import { definePlugin } from '@v-md/core'
import { createMarkdownThemeMap } from './map'

declare module '@v-md/core' {
  interface EditorOptions {
    /**
     * 内容主题
     * @default 'none'
     */
    theme?: string

    /**
     * 如果开启内容主题标题栏，则可以设置标题栏的选项
     *
     * 若不设置，选项会包含所有内置主题
     */
    themeToolbarSelections?: string[]
  }
}

const DEFAULT_THEME = 'none'

/** 添加主题样式的 key */
export const THEME_BASE_KEY = 'theme'

export function themePlugin() {
  const themeMap = createMarkdownThemeMap()

  function setTheme(file: FileNode, themeKey: string) {
    const themeItem = themeMap[themeKey]

    if (!themeItem) {
      return
    }

    const { css, js } = themeItem

    file.compiler.cssExtra.set(THEME_BASE_KEY, css || '')
    file.compiler.jsExtra.set(THEME_BASE_KEY, js || '')
  }

  return definePlugin({
    name: 'theme',

    onFilesInitted: (files) => {
      const mainFile = files.keyFiles.main
      if (!mainFile) {
        return
      }

      // 为编译入口文件添加额外主题代码
      setTheme(mainFile, files.editor.options.theme || DEFAULT_THEME)
    },

    onToolbarInit: (toolbar) => {
      if (toolbar.type !== 'editor') {
        return
      }

      const { options } = toolbar.editor

      const selections = options.themeToolbarSelections ?
          Object.keys(themeMap).filter(item => options.themeToolbarSelections?.includes(item)) :
          Object.keys(themeMap)

      toolbar.presetMap.theme = {
        type: 'select',
        name: 'theme',
        icon: import('.//theme.svg').then(m => m.default),
        value: options.theme || DEFAULT_THEME,
        tip: '内容主题',
        options: selections.map(item => ({
          label: item,
          value: item,
        })),
        onTrigger: (editor, value) => {
          editor.options.theme = value

          // 重置主文件的编译状态
          const mainFile = editor.files.keyFiles.main
          if (mainFile) {
            mainFile.compiler.reset()
            setTheme(mainFile, value)

            // 触发重新编译渲染
            editor.files.preview.update()
          }
        },
      }
    },
  })
}
