import { cloneDeep } from './clone-deep'
import {
  isArray,
  isObjectLike,
} from './type-check'

export interface MergeShallowFuncOptions {
  /**
   * 同 key 字段是否覆盖
   * @default true
   */
  override?: boolean

  /**
   * 是否忽略显式声明的 undefined
   * @default false
   */
  ignoreUndef?: boolean

  /**
   * 是否创建一个新对象。当不创建新对象时，最终结果将合并入首个合并参数
   *
   * 新对象完全通过深拷贝创建
   * @default true
   */
  createNew?: boolean
}

/**
 * 浅合并
 * @param options
 * @param a
 * @param b
 * @param rests
 * @returns 合并后的对象
 */
export function mergeShallow<T = any>(
  options: MergeShallowFuncOptions,
  a: any,
  b: any,
  ...rests: any[]
): T {
  const {
    override = true,
    ignoreUndef = false,
    createNew = true,
  } = options

  const isAObject = isObjectLike(a)
  const isBObject = isObjectLike(b)

  if (!isAObject && !isBObject) {
    return b
  }

  if (!isAObject) {
    return createNew ? cloneDeep(b) : b
  }

  if (!isBObject) {
    return createNew ? cloneDeep(a) : a
  }

  const result = createNew ? cloneDeep(a) : a

  for (const key in b) {
    if (_shouldWrite(result, b, key, override, ignoreUndef))
      result[key] = b[key]
  }

  return rests.length > 0 ?
      mergeShallow<T>({
        ...options,
        createNew: false,
      }, result, rests[0], ...rests.slice(1)) :
    result as T
}

export interface MergeDeepFuncOptions extends MergeShallowFuncOptions {
  /**
   * 合并过程中，若两个相同的 key 都是数组，如何处理
   * - concat: 拼接处理
   * - override: 整体覆盖处理
   * - object: 按照对象的方式，同 key 覆盖处理
   * @default 'object'
   */
  array?: 'concat' | 'override' | 'object'
}

/**
 * 深合并
 * @param options
 * @param a
 * @param b
 * @param rests
 * @returns 合并后的对象
 */
export function mergeDeep<T = any>(
  options: MergeDeepFuncOptions,
  a: any,
  b: any,
  ...rests: any[]
): T {
  const {
    override = true,
    ignoreUndef = false,
    createNew = true,
    array = 'object',
  } = options

  if (!isObjectLike(a) || !isObjectLike(b)) {
    return mergeShallow<T>(options, a, b, ...rests)
  }

  const result = createNew ? cloneDeep(a) : a

  for (const key in b) {
    const val = b[key]

    // b 不为对象
    if (!isObjectLike(val)) {
      if (_shouldWrite(result, b, key, override, ignoreUndef))
        result[key] = val
      continue
    }

    const origin = result[key]

    // a 不为对象，b 为对象
    if (!isObjectLike(origin)) {
      if (_shouldWrite(result, b, key, override, ignoreUndef))
        result[key] = val
      continue
    }

    // a 和 b 都是数组，按照设定好的数组拼接策略处理
    if (isArray(origin) && isArray(val)) {
      if (array === 'concat') {
        result[key] = origin.concat(val)
        continue
      }
      else if (array === 'override') {
        result[key] = val
        continue
      }
    }

    // 对 a 和 b 采取常规对象合并策略
    result[key] = mergeDeep({
      ...options,
      createNew: false,
    }, origin, val)
  }

  return rests.length > 0 ?
      mergeDeep<T>({
        ...options,
        createNew: false,
      }, result, rests[0], ...rests.slice(1)) :
    result as T
}

function _shouldWrite(
  a: Record<string, any>,
  b: Record<string, any>,
  key: string,
  override: boolean,
  ignoreUndef: boolean,
): boolean {
  const aVal = a[key]
  const bVal = b[key]

  const isAUndef = aVal === undefined
  /** A 是否显式声明 */
  const isAVisible = Object.prototype.hasOwnProperty.call(a, key)
  /** A 是否有效，包括非 undefined 值和显式 undefined */
  const isAEffective = !isAUndef || (isAUndef && isAVisible && !ignoreUndef)

  const isBUndef = bVal === undefined
  /** B 是否显式声明 */
  const isBVisible = Object.prototype.hasOwnProperty.call(b, key)
  /** A 是否有效，包括非 undefined 值和显式 undefined */
  const isBEffective = !isBUndef || (isBUndef && isBVisible && !ignoreUndef)

  // 列举所有覆写的场景
  return isBEffective && (override || !isAEffective)
}

export {
  merge,
  mergeWith,
} from 'lodash-es'
