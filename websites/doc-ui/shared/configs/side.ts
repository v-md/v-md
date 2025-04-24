import type { DefaultTheme } from 'vitepress'
import type { VitePressSidebarOptions } from 'vitepress-sidebar/types'
import { readdirSync } from 'node:fs'
import { generateSidebar } from 'vitepress-sidebar'

export interface VitepressSideConfigOptions {
  /** 自动生成侧边栏选项时排除的目录 */
  exclude?: string[]

  /** 对于每个检索目录，如何生成 vitepress-sidebar 的配置项 */
  sidebarOptions?: (dir: string) => VitePressSidebarOptions
}

export function vitepressSideConfig(opts: VitepressSideConfigOptions = {}): DefaultTheme.Config['sidebar'] {
  const {
    exclude = [
      'public',
      'demo',
    ],
    sidebarOptions,
  } = opts

  const dirs = readdirSync('docs', {
    encoding: 'utf-8',
    withFileTypes: true,
  })
    .filter(item => item.isDirectory())
    .map(item => item.name)
    .filter(item => !exclude.includes(item))

  // https://vitepress-sidebar.jooy2.com/api
  const options: VitePressSidebarOptions[] = dirs.map(item => ({
    scanStartPath: `docs/${item}`,
    resolvePath: `/${item}/`,
    useTitleFromFileHeading: true,
    useFolderTitleFromIndexFile: true,
    includeRootIndexFile: false,
    ...sidebarOptions?.(item),
  }))

  return generateSidebar(options)
}
