import type { FileSystem, FileType } from '@vue/language-service'
import type { URI } from 'vscode-uri'
import type { WorkerMessage } from '../types'

// 让 volar 能够从自定义 CDN 地址导入依赖
// 参考：https://github1s.com/volarjs/volar.js/blob/master/packages/jsdelivr/lib/npm.ts

type CdnOptions = Pick<WorkerMessage, 'cdnUrl' | 'cdnDataUrl' | 'cdnType'>
interface UnpkgNode {
  path: string
  type: 'file' | 'directory'
  files?: UnpkgNode[]
  size?: number
  integrity?: string
  lastModified?: string
}

interface JsdelivrNode {
  name: string
  size: number
  time: string
  hash: string
}

const textCache = new Map<string, Promise<string | undefined>>()
const jsonCache = new Map<string, Promise<any>>()

export function createNpmFileSystem(
  options: CdnOptions,
  getCdnPath = (uri: URI): string | undefined => {
    if (uri.path === '/node_modules') {
      return ''
    }
    else if (uri.path.startsWith('/node_modules/')) {
      return uri.path.slice('/node_modules/'.length)
    }
  },
  getPackageVersion?: (pkgName: string) => string | undefined,
  onFetch?: (path: string, content: string) => void,
): FileSystem {
  const {
    cdnUrl,
    cdnDataUrl,
    cdnType,
  } = options

  const fetchResults = new Map<string, Promise<string | undefined>>()
  const flatResults = new Map<string, Promise<{
    name: string
    size: number
    time: string
    hash: string
  }[]>>()

  return {
    async stat(uri) {
      const path = getCdnPath(uri)
      if (path === undefined) {
        return
      }
      if (path === '') {
        return {
          type: 2 satisfies FileType.Directory,
          size: -1,
          ctime: -1,
          mtime: -1,
        }
      }
      return _stat(path)
    },
    async readFile(uri) {
      const path = getCdnPath(uri)
      if (path === undefined) {
        return
      }
      return _readFile(path)
    },
    readDirectory(uri) {
      const path = getCdnPath(uri)
      if (path === undefined) {
        return []
      }
      return _readDirectory(path)
    },
  }

  async function _stat(path: string) {
    const [modName, pkgName, pkgVersion, pkgFilePath] = resolvePackageName(path)
    if (!pkgName) {
      if (modName.startsWith('@')) {
        return {
          type: 2 satisfies FileType.Directory,
          ctime: -1,
          mtime: -1,
          size: -1,
        }
      }
      else {
        return
      }
    }
    if (!await isValidPackageName(pkgName)) {
      return
    }

    if (!pkgFilePath) {
      // perf: skip flat request
      return {
        type: 2 satisfies FileType.Directory,
        ctime: -1,
        mtime: -1,
        size: -1,
      }
    }

    if (!flatResults.has(modName)) {
      flatResults.set(modName, flat(pkgName, pkgVersion))
    }

    const flatResult = await flatResults.get(modName)
    const filePath = path.slice(modName.length)
    const file = flatResult?.find(file => file.name === filePath)
    if (file) {
      return {
        type: 1 satisfies FileType.File,
        ctime: new Date(file.time).valueOf(),
        mtime: new Date(file.time).valueOf(),
        size: file.size,
      }
    }
    else if (flatResult?.some(file => file.name.startsWith(`${filePath}/`))) {
      return {
        type: 2 satisfies FileType.Directory,
        ctime: -1,
        mtime: -1,
        size: -1,
      }
    }
  }

  async function _readDirectory(path: string): Promise<[string, FileType][]> {
    const [modName, pkgName, pkgVersion] = resolvePackageName(path)
    if (!pkgName || !await isValidPackageName(pkgName)) {
      return []
    }

    if (!flatResults.has(modName)) {
      flatResults.set(modName, flat(pkgName, pkgVersion))
    }

    const flatResult = await flatResults.get(modName)
    const dirPath = path.slice(modName.length)
    const files = flatResult?.filter(f => f.name.substring(0, f.name.lastIndexOf('/')) === dirPath)
      .map(f => f.name.slice(dirPath.length + 1)) || []
    const dirs = flatResult?.filter(f => f.name.startsWith(`${dirPath}/`) && f.name.substring(dirPath.length + 1).split('/').length >= 2)
      .map(f => f.name.slice(dirPath.length + 1).split('/')[0]) || []

    return [
      ...files.map<[string, FileType]>(f => [f, 1 satisfies FileType.File]),
      ...[...new Set(dirs)].map<[string, FileType]>(f => [f, 2 satisfies FileType.Directory]),
    ]
  }

  async function _readFile(path: string): Promise<string | undefined> {
    const [_modName, pkgName, _version, pkgFilePath] = resolvePackageName(path)
    if (!pkgName || !pkgFilePath || !await isValidPackageName(pkgName)) {
      return
    }

    if (!fetchResults.has(path)) {
      fetchResults.set(path, (async () => {
        if ((await _stat(path))?.type !== 1 satisfies FileType.File) {
          return
        }
        const text = await fetchText(`${cdnUrl}/${path}`)
        if (text !== undefined) {
          onFetch?.(path, text)
        }
        return text
      })())
    }

    return fetchResults.get(path)
  }

  async function flat(pkgName: string, version: string | undefined) {
    version ??= 'latest'

    // resolve latest tag
    if (version === 'latest') {
      const data = await fetchJson<{ version: string | null }>(
        cdnType === 'jsdelivr' ?
          `${cdnDataUrl}/package/resolve/npm/${pkgName}@${version}` :
          `${cdnUrl}/${pkgName}@${version}/package.json`,
      )
      if (!data?.version) {
        return []
      }
      version = data.version
    }

    if (cdnType === 'jsdelivr') {
      const flat = await fetchJson<{
        files: JsdelivrNode[]
      }>(`${cdnDataUrl}/package/npm/${pkgName}@${version}/flat`)
      if (!flat) {
        return []
      }

      return flat.files
    }
    else {
      const tree = await fetchJson<UnpkgNode>(`${cdnUrl}/${pkgName}@${version}/?meta`)
      if (!tree) {
        return []
      }
      return _flatTree(tree)
    }
  }

  function _flatTree(root: UnpkgNode): JsdelivrNode[] {
    const result: UnpkgNode[] = []
    const stack: UnpkgNode[] = [...(root.files || [])]

    while (stack.length > 0) {
      const cur = stack.pop()
      if (!cur) {
        break
      }

      if (cur.type === 'file') {
        result.push(cur)
      }

      if (cur.type === 'directory') {
        stack.push(...(cur.files || []))
      }
    }

    return result.map<JsdelivrNode>(node => ({
      name: node.path,
      size: node.size || 0,
      hash: node.integrity || '',
      time: node.lastModified || '',
    }))
  }

  async function isValidPackageName(pkgName: string) {
    // ignore @aaa/node_modules
    if (pkgName.endsWith('/node_modules')) {
      return false
    }
    // hard code to skip known invalid package
    if (pkgName.endsWith('.d.ts') || pkgName.startsWith('@typescript/') || pkgName.startsWith('@types/typescript__')) {
      return false
    }
    // don't check @types if original package already having types
    if (pkgName.startsWith('@types/')) {
      let originalPkgName = pkgName.slice('@types/'.length)
      if (originalPkgName.includes('__')) {
        originalPkgName = `@${originalPkgName.replace('__', '/')}`
      }
      const packageJson = await _readFile(`${originalPkgName}/package.json`)
      if (!packageJson) {
        return false
      }
      const packageJsonObj = JSON.parse(packageJson)
      if (packageJsonObj.types || packageJsonObj.typings) {
        return false
      }
      const indexDts = await _stat(`${originalPkgName}/index.d.ts`)
      if (indexDts?.type === 1 satisfies FileType.File) {
        return false
      }
    }
    return true
  }

  /**
   * @example
   * "a/b/c" -> ["a", "a", undefined, "b/c"]
   * "@a" -> ["@a", undefined, undefined, ""]
   * "@a/b/c" -> ["@a/b", "@a/b", undefined, "c"]
   * "@a/b@1.2.3/c" -> ["@a/b@1.2.3", "@a/b", "1.2.3", "c"]
   */
  function resolvePackageName(input: string): [
    modName: string,
    pkgName: string | undefined,
    version: string | undefined,
    path: string,
  ] {
    const parts = input.split('/')
    let modName = parts[0]
    let path: string
    if (modName.startsWith('@')) {
      if (!parts[1]) {
        return [modName, undefined, undefined, '']
      }
      modName += `/${parts[1]}`
      path = parts.slice(2).join('/')
    }
    else {
      path = parts.slice(1).join('/')
    }
    let pkgName = modName
    let version: string | undefined
    if (modName.lastIndexOf('@') >= 1) {
      pkgName = modName.substring(0, modName.lastIndexOf('@'))
      version = modName.substring(modName.lastIndexOf('@') + 1)
    }
    if (!version && getPackageVersion) {
      getPackageVersion?.(pkgName)
    }
    return [modName, pkgName, version, path]
  }
}

async function fetchText(url: string) {
  if (!textCache.has(url)) {
    textCache.set(url, (async () => {
      try {
        const res = await fetch(url)
        if (res.status === 200) {
          return await res.text()
        }
      }
      catch {
        // ignore
      }
    })())
  }
  return textCache.get(url)
}

async function fetchJson<T>(url: string) {
  if (!jsonCache.has(url)) {
    jsonCache.set(url, (async () => {
      try {
        const res = await fetch(url)
        if (res.status === 200) {
          return await res.json()
        }
      }
      catch {
        // ignore
      }
    })())
  }
  return await jsonCache.get(url) as T
}
