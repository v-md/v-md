import type { DynamicImportResolver } from '@v-md/shared'
import type { WatchHandle } from 'vue'

/** 用户设置的翻译字典格式，允许深层对象解构 */
export interface LocaleDict {
  [key: string]: string | LocaleDict
}

/** 系统处理后的翻译字典格式，会拍平嵌套结构 */
export interface LocaleDictFlat {
  [key: string]: string
}

/**
 * 系统翻译字典数据
 * @key 语言
 * @value 翻译字典。支持动态加载
 */
export type LocaleMap = Record<string, LocaleDictFlat>

/**
 * 一个模块对应的翻译字典
 * @key 语言
 * @value 翻译字典。支持动态加载
 */
export type LocaleModuleMap = Record<string, DynamicImportResolver<LocaleDict>>

/** 翻译模块数据对象 */
export interface LocaleModule {
  /** 模块名称 */
  name: string

  /** 模块翻译字典 */
  map: LocaleModuleMap

  /** 记录翻译字典已激活的语言 */
  _activeLang: Set<string>

  /** 该模块对应的监听器(监听语言变化)注销函数 */
  _stopWatch: WatchHandle
}

/** 翻译初始化选项 */
export interface LocaleOptions {
  /**
   * 初始语言
   * @default 'zh_cn'
   */
  lang?: string

  /**
   * 初始注册的翻译模块
   * @key 模块名称
   * @value 模块翻译字典
   * @default {}
   */
  modules?: Record<string, LocaleModuleMap>
}
