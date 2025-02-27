/** 路径字符串连接(浏览器环境使用) */
export function join(...args: string[]): string {
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
  if (isFolder) {
    return ''
  }
  const nameArr = name.split('.')
  return nameArr.length > 1 ? nameArr[nameArr.length - 1] : ''
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
