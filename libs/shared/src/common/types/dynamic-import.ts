/** 动态导入解析类型 */
export type DynamicImportResolver<T = string> = T | (() => T) | Promise<T> | (() => Promise<T>)
