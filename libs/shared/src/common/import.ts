import type { ImportMap } from './types'
import { isLocalPath } from './path'

export interface ResolveImportSourceResult {
  /**
   * - 'remote-script' 远程脚本，如果在 import-map 中有声明，浏览器的 <script type="module"> 标签可以自行处理。目前只包括 .js 和 .mjs 脚本。
   * - 'remote-resource' 远程资源，无法被识别为 content-type: application/javascript。需要转化为文件系统中的虚拟文件处理
   * - 'local' 本地文件
   */
  type: 'remote-script' | 'remote-resource' | 'local'

  /** 是否命中 import-map */
  fromImportMap?: boolean

  /** 远程导入 url */
  urlSource?: string
}

/**
 * 判断一个导入来源的类型。如果来源为远程地址，一并获取远程导入 url
 * @param importMap Import Map 配置
 * @param importSource 导入来源
 */
export function resolveImportSource(importMap: ImportMap, importSource: string): ResolveImportSourceResult {
  if (isLocalPath(importSource)) {
    return { type: 'local' }
  }

  let urlSource = ''
  let fromImportMap = false
  if (importSource.startsWith('http://') || importSource.startsWith('https://')) {
    urlSource = importSource
  }
  else {
    const importMapEntries = Object.entries(importMap.imports || {})
    for (const [key, value] of importMapEntries) {
      if (key === importSource) {
        urlSource = String(value)
        fromImportMap = true
        break
      }

      if (key.endsWith('/') && importSource.startsWith(key)) {
        urlSource = `${String(value)}${importSource.slice(key.length)}`
        fromImportMap = true
        break
      }
    }
  }

  if (!urlSource) {
    return { type: 'local' }
  }

  if (urlSource.endsWith('.js') || urlSource.endsWith('.mjs')) {
    return { type: 'remote-script', urlSource, fromImportMap }
  }

  return { type: 'remote-resource', urlSource, fromImportMap }
}
