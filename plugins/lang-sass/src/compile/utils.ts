import type { FileNode } from '@v-md/core'
import {
  baseAndExtName,
  parentAndNameFromPath,
} from '@v-md/shared'

export const VALID_SASS_EXT = ['scss', 'sass', 'css']

/**
 * 根据 sass 远程 HTTP 路径，寻找对应的文件。首次访问会尝试创建文件。
 * @param url 目标 sass 文件的远程 url
 * @param file sass 入口文件节点
 */
export async function findSassFileRemote(url: string, file: FileNode) {
  const { manager } = file

  const folder = file.manager.nodeModulesParentPath(url)
  if (!folder) {
    return null
  }

  const [, name] = parentAndNameFromPath(url)
  const tryNames = getSassTryNames(name)

  let target: FileNode | null = null
  for (const name of tryNames) {
    target = await manager.nodeModulesFetchFile(url, folder, name)
    if (target) {
      break
    }
  }
  return target
}

/**
 * 根据 sass 本地绝对路径，寻找对应的文件
 * @param filePath 目标 sass 文件的绝对路径
 * @param file sass 入口文件节点
 */
export function findSassFileLocal(filePath: string, file: FileNode) {
  const [parent, name] = parentAndNameFromPath(filePath)
  const tryNames = getSassTryNames(name)

  let target: FileNode | null = null
  for (const name of tryNames) {
    target = file.getNodeByPath(`${parent}/${name}`)
    if (target) {
      break
    }
  }
  return target
}

export function sassLoadError(url: string) {
  throw new Error(`Sass compile error: cannot load ${url}`)
}

function getSassTryNames(name: string) {
  const [base, ext] = baseAndExtName(name)
  const tryNames: string[] = []
  if (VALID_SASS_EXT.includes(ext)) {
    tryNames.push(name)
  }
  else {
    VALID_SASS_EXT.forEach((ext) => {
      tryNames.push(`${base}.${ext}`, `_${base}.${ext}`)
    })
  }
  return tryNames
}
