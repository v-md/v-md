import type { DynamicImportResolver } from '@v-md/shared'

export function defaultFileExtToIcon(): Record<string, { icon: DynamicImportResolver, color: string }> {
  return {
    folder: {
      icon: import('../../assets/icons/folder.svg').then(m => m.default),
      color: '',
    },
    file: {
      icon: import('../../assets/icons/file.svg').then(m => m.default),
      color: '',
    },
  }
}

export function defaultFileExtToLang(): Record<string, string> {
  return {
    others: 'plaintext',
  }
}
