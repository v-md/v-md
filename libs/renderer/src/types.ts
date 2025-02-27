import type { ImportMap } from '@v-md/shared'

/** 编译后的数据对象 */
export interface CompiledData {
  /** 依赖信息对象 */
  importMap: ImportMap

  /**
   * 编译后的代码对象
   * @key 文件绝对路径
   */
  codes: Record<string, CompiledCodeData>

  /** 编译入口 */
  main: string
}

export interface CompiledCodeData {
  /** 未替换引用源的 js 代码 */
  js: string

  /**
   * 记忆引用源位置节点
   * 0 - 引用源起始位置
   * 1 - 引用源结束位置
   * 2 - 引用源文件路径
   */
  mem: [number, number, string][]

  /** 替换引用源的最终 js 代码 */
  moduleJs?: string

  /** 最终 js 代码对应的 url */
  url?: string
}

export interface ViewerOptions {
  /**
   * 必传，展示的内容。
   *
   * 可以传编译后的数据对象，或者改数据对象压缩后的内容
   */
  value: string | CompiledData

  /** 沙盒中 polyfill 资源加载路径 */
  cdnUrl?: string

  /** 预览选项 */
  previewOptions?: {
    /** HTML 头部中添加的内容 */
    headHtml?: string
  }
}
