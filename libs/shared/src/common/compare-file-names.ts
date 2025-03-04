import { isNumStr } from './type-check'

/**
 * 比较两个文件名称，确定文件的排序规则
 * @param a 文件名
 * @param b 文件名
 * @returns
 * - 若返回 -1，则 a 在 b 之前；
 * - 若返回 1，则 a 在 b 之后；
 * - 若返回 0，则 a 和 b 相等
 */
export function compareFileNames(a: string, b: string): number {
  const reg = /[.\-_]/
  const aParts = a.split(reg)
  const bParts = b.split(reg)

  for (let i = 0; i < aParts.length || i < bParts.length; i++) {
    const aPart = aParts[i] || ''
    const bPart = bParts[i] || ''

    let delta = 0
    if (isNumStr(aPart) && isNumStr(bPart)) {
      delta = Number(aPart) - Number(bPart)
    }
    else {
      delta = aPart.localeCompare(bPart)
    }

    if (delta !== 0) {
      return delta > 0 ? 1 : -1
    }
  }

  return 0
}
