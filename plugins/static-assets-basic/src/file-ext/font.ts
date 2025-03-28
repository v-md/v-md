import type { FileExtInfo } from '@v-md/core'

export function resolveFontExt(info: Record<string, FileExtInfo>) {
  info.otf = {
    icon: import('../assets/font.svg').then(m => m.default),
    mime: 'font/otf',
    editorComponent: null,
  }
  info.ttf = {
    icon: import('../assets/font.svg').then(m => m.default),
    mime: 'font/ttf',
    editorComponent: null,
  }
  info.woff = {
    icon: import('../assets/font.svg').then(m => m.default),
    mime: 'font/woff',
    editorComponent: null,
  }
  info.woff2 = {
    icon: import('../assets/font.svg').then(m => m.default),
    mime: 'font/woff2',
    editorComponent: null,
  }
}
