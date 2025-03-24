/** 动态导入解析类型 */
export type DynamicImportResolver<T = string> = (() => Promise<T>) | Promise<T> | (() => T) | T
