/**
 * 将一个数组值推送到一个对象中，如果该键不存在，则创建该键
 * @param obj 操作对象
 * @param key 操作键
 * @param pushArr 待推送数组
 */
export function pushOrCreate<
  T extends Record<string, any> = Record<string, any>,
  K extends keyof T = keyof T,
>(obj: T, key: K, pushArr: T[K]) {
  if (!Array.isArray(pushArr)) {
    return
  }

  if (obj[key]) {
    obj[key].push(...(pushArr as any[]))
  }
  else {
    obj[key] = pushArr
  }
}

/**
 * 将一个值推送到一个对象中，如果该键不存在，则创建该键
 * @param parentObj
 * @param key
 * @param childKey
 * @param value
 */
export function setOrCreate<
  T extends Record<string, any> = Record<string, any>,
  K extends keyof T = keyof T,
  U extends keyof Exclude<T[K], undefined | null> = keyof Exclude<T[K], undefined | null>,
>(parentObj: T, key: K, childKey: U, value: T[K][U]) {
  if (!parentObj[key]) {
    parentObj[key] = {} as any
  }

  parentObj[key][childKey] = value
}
