/** 路径字符串连接(浏览器环境使用)，生成的路径没有 / 开头 */
export function joinPath(...args: string[]) {
  const len = args.length
  if (len === 0) {
    return ''
  }

  const sep = '/'
  const resArr: string[] = []
  for (let i = 0; i < len; i++) {
    const curArr = args[i].split(sep)
    curArr.forEach((section) => {
      if (section === '..') {
        resArr.pop()
      }
      else if (section !== '' && section !== '.') {
        resArr.push(section)
      }
    })
  }

  return resArr.join(sep)
}

/**
 * 获取文件扩展名((浏览器环境使用))
 * @param name 文件名称
 * @param isFolder 是否为文件夹。默认为 false
 */
export function extname(name: string, isFolder: boolean = false) {
  return baseAndExtName(name, isFolder)[1]
}

/**
 * 获取文件基础名称((浏览器环境使用))
 * @param name 文件名称
 */
export function basename(name: string) {
  return baseAndExtName(name)[0]
}

/**
 * 获取文件基础名称和后缀名((浏览器环境使用))
 * @param name 文件名称
 * @param isFolder 是否为文件夹。默认为 false
 */
export function baseAndExtName(name: string, isFolder: boolean = false) {
  if (isFolder) {
    return [name, '']
  }
  const nameArr = name.split('.')
  return nameArr.length > 1 ?
      [nameArr.slice(0, nameArr.length - 1).join('.'), nameArr[nameArr.length - 1]] :
      [name, '']
}

/** 判断路径是否为绝对路径 */
export function isAbsolutePath(path: string) {
  return path.startsWith('/')
}

/** 判断路径是否为本地路径 */
export function isLocalPath(path: string) {
  return path.startsWith('./') ||
    path.startsWith('../') ||
    path.startsWith('/')
}

/** 从路径中获取文件、目录名 */
export function nameFromPath(path: string) {
  return parentAndNameFromPath(path)[1]
}

/** 从路径中获取父目录路径 */
export function parentFromPath(path: string) {
  return parentAndNameFromPath(path)[0]
}

/** 从路径中获取父目录路径和文件、目录名 */
export function parentAndNameFromPath(path: string) {
  const pathArr = path.split('/')
  return [pathArr.slice(0, -1).join('/'), pathArr[pathArr.length - 1] || '']
}

/** 替换路径中的文件名称 */
export function replacePathName(path: string, name: string) {
  return `${parentFromPath(path)}/${name}`
}
