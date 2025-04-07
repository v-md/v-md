import type { FileNode } from '@v-md/core'
import type { ImporterResult } from 'sass'
import {
  isFileUrl,
  isHttpUrl,
} from '@v-md/shared'
import { sassLoadError } from './utils'

export function getLoader(file: FileNode) {
  return async (urlObj: URL): Promise<ImporterResult | null> => {
    // 文件定位已在 canonicalize 中处理，此处的 url 均已经矫正
    const url = urlObj.toString()
    if (isFileUrl(url)) {
      const filePath = `/${url.toString().replace('file://', '')}`
      const target = file.getNodeByPath(filePath)
      if (!target) {
        throw sassLoadError(filePath)
      }

      return {
        contents: target.content.value,
        syntax: 'scss',
      }
    }

    if (!isHttpUrl(url)) {
      throw sassLoadError(url)
    }

    const target = await file.manager.nodeModulesFetch(url)
    if (!target) {
      throw sassLoadError(url)
    }

    return {
      contents: target.content.value,
      syntax: 'scss',
    }
  }
}
