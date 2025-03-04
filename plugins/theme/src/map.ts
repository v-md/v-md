import type { DynamicImportResolver } from '@v-md/shared'

export interface ThemeItem {
  css?: DynamicImportResolver
  js?: DynamicImportResolver
}

async function vitepressCssLoader() {
  let result = ''
  const [vars, base, doc] = await Promise.all([
    import('./theme/vitepress/var.css?raw').then(m => m.default),
    import('./theme/vitepress/base.css?raw').then(m => m.default),
    import('./theme/vitepress/doc.css?raw').then(m => m.default),
  ])
  result += `${vars}\n${base}\n${doc}`
  return result
}

export function createMarkdownThemeMap(): Record<string, ThemeItem> {
  return {
    'none': {},
    'vitepress': {
      css: () => vitepressCssLoader(),
    },
    'vitepress-dark': {
      css: () => vitepressCssLoader(),
      js: () => import('./theme/vitepress/dark.js?raw').then(m => m.default),
    },
  }
}
