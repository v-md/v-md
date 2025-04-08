import type { FileNode } from '@v-md/core'
import type { ImportMap } from '@v-md/shared'
import {
  isFileUrl,
  isHttpUrl,
  joinPath,
  replacePathName,
  resolveImportSource,
} from '@v-md/shared'
import {
  findSassFileLocal,
  findSassFileRemote,
  sassLoadError,
} from './utils'

export function getCanonicalize(file: FileNode) {
  return (url: string) => {
    if (isHttpUrl(url)) {
      return httpCanonicalize(url, file)
    }
    else if (isFileUrl(url)) {
      return fileCanonicalize(url, file)
    }
    else {
      return commonCanonicalize(url, file)
    }
  }
}

export async function httpCanonicalize(url: string, file: FileNode) {
  const target = await findSassFileRemote(url, file)
  if (!target) {
    throw sassLoadError(url)
  }

  // url 替换为矫正过后的文件名，确保文件与 url 唯一对应
  const finalUrl = replacePathName(url, target.name.value)
  return new URL(finalUrl)
}

export async function fileCanonicalize(url: string, file: FileNode) {
  // 获取绝对路径
  const filePath = `/${url.replace('file://', '')}`
  const target = findSassFileLocal(filePath, file)
  if (!target) {
    throw sassLoadError(filePath)
  }

  return new URL(`file:${target.path.value}`)
}

export function commonCanonicalize(url: string, file: FileNode) {
  const importMap = file.manager.keyFiles.importMap?.getJson<ImportMap>() || {}
  const { type, urlSource } = resolveImportSource(importMap, url)

  if (type === 'remote-script') {
    throw sassLoadError(urlSource || '')
  }

  if (type === 'remote-resource') {
    // HTTP URL
    return httpCanonicalize(urlSource || '', file)
  }

  // 其他情况视为本地文件，走文件解析。
  const fileUrl = `file://${joinPath(file.dirPath.value, url)}`
  return fileCanonicalize(fileUrl, file)
}
