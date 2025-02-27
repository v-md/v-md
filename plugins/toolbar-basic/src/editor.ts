import type { ToolbarItemOptions, ToolbarItemsSetting } from '@v-md/core'

export function createEditorToolbarPresetMap(): Record<string, ToolbarItemOptions> {
  return {
    '|': { type: 'split' },
    'header': {
      type: 'submenu',
      name: 'header',
      icon: import('./icons/format-header.svg').then(m => m.default),
      options: [
        {
          icon: import('./icons/format-header-1.svg').then(m => m.default),
          label: '一级标题',
          value: 1,
        },
        {
          icon: import('./icons/format-header-2.svg').then(m => m.default),
          label: '二级标题',
          value: 2,
        },
        {
          icon: import('./icons/format-header-3.svg').then(m => m.default),
          label: '三级标题',
          value: 3,
        },
        {
          icon: import('./icons/format-header-4.svg').then(m => m.default),
          label: '四级标题',
          value: 4,
        },
        {
          icon: import('./icons/format-header-5.svg').then(m => m.default),
          label: '五级标题',
          value: 5,
        },
        {
          icon: import('./icons/format-header-6.svg').then(m => m.default),
          label: '六级标题',
          value: 6,
        },
      ],
    },
  }
}

export function createEditorToolbarPresetItems(): ToolbarItemsSetting[] {
  return [
    'header',
    '|',
    'editor-theme',
    'theme',
    'highlight-theme',
  ]
}
