import type { FileExtInfo } from '@v-md/core'

export function resolveImageExt(info: Record<string, FileExtInfo>) {
  info.jpg = {
    icon: import('../assets/image.svg').then(m => m.default),
    mime: 'image/jpeg',
    editorComponent: import('../views/image-viewer.vue').then(m => m.default),
  }
  info.jpeg = {
    icon: import('../assets/image.svg').then(m => m.default),
    mime: 'image/jpeg',
    editorComponent: import('../views/image-viewer.vue').then(m => m.default),
  }
  info.png = {
    icon: import('../assets/image.svg').then(m => m.default),
    mime: 'image/png',
    editorComponent: import('../views/image-viewer.vue').then(m => m.default),
  }
  info.gif = {
    icon: import('../assets/image.svg').then(m => m.default),
    mime: 'image/gif',
    editorComponent: import('../views/image-viewer.vue').then(m => m.default),
  }
  info.webp = {
    icon: import('../assets/image.svg').then(m => m.default),
    mime: 'image/webp',
    editorComponent: import('../views/image-viewer.vue').then(m => m.default),
  }
  info.svg = {
    icon: import('../assets/svg.svg').then(m => m.default),
    mime: 'image/svg+xml',
    editorComponent: import('../views/image-viewer.vue').then(m => m.default),
  }
}
