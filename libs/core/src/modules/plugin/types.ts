import type { Promisable } from '@v-md/shared'
import type { CompileCodeResult, Compiler } from '../compiler'
import type { Editor } from '../editor'
import type { FileManager } from '../file'
import type { Monaco } from '../monaco'
import type { Toolbar } from '../toolbar'

export interface Plugin {
  /** 插件名称，必传。多个插件不可重名 */
  name: string

  /**
   * 编辑器生成默认配置项时触发。插件如果需要拓展编辑器配置，可以在此方法中补充缺省配置。
   * @param editor 编辑器对象
   */
  onOptionsDefault?: (editor: Editor) => Promisable<void>

  /**
   * 编辑器生成合并完用户配置后触发。插件如果需要修改最终配置项，需要在此方法中实现。
   * @param editor 编辑器对象
   */
  onOptionsResolved?: (editor: Editor) => Promisable<void>

  /**
   * 编辑器应用销毁时触发
   * @param editor 编辑器对象
   */
  onDestroy?: (editor: Editor) => Promisable<void>

  /**
   * Monaco Editor 初始化开始
   * @param monaco Monaco Editor 管理对象
   */
  onMonacoInit?: (monaco: Monaco) => Promisable<void>

  /**
   * Monaco Editor 初始化完成
   * @param monaco Monaco Editor 管理对象
   */
  onMonacoInitted?: (monaco: Monaco) => Promisable<void>

  /**
   * 文件系统初始化开始。
   * @param files 文件管理对象
   */
  onFilesInit?: (files: FileManager) => Promisable<void>

  /**
   * 文件系统在没有内容时，创建初始文件。
   *
   * 若编辑器有初始值，则不会触发
   * @param files 文件管理对象
   */
  onFilesCreate?: (files: FileManager) => Promisable<void>

  /**
   * 文件系统初始化完成后触发
   * @param files 文件管理对象
   */
  onFilesInitted?: (files: FileManager) => Promisable<void>

  /**
   * 文件的编译过程。
   *
   * 某些文件可能需要多步编译，如 markdown -> vue -> template & script & style，
   * 多步编译时，需要指定编译语言与编译内容，继续触发本钩子。
   * @param compiler 文件编译器
   * @param result 本轮编译结果将存入此对象。
   * @param lang 编译语言。必须指定，首轮编译时设置为文件后缀。
   * @param code 编译内容。若不指定，首轮编译时设置为文件内容。
   */
  onFileCompile?: (
    compiler: Compiler,
    result: CompileCodeResult,
    lang: string,
    code: string
  ) => Promisable<void>

  /**
   * 标题栏初始化
   * @param toolbar 标题栏管理对象
   * @returns
   */
  onToolbarInit?: (toolbar: Toolbar) => void

  /**
   * 标题栏初始化完成后
   * @param toolbar 标题栏管理对象
   * @returns
   */
  onToolbarInitted?: (toolbar: Toolbar) => void
}

export type PluginHooks = Omit<Plugin, 'name'>

export type PluginScanResult = {
  [K in keyof Required<PluginHooks>]?: number
} & {
  /** 插件名称 */
  name: string
}

export interface PluginInsertOptions {
  /**
   * 插入到指定名称插件之前。
   *
   * 若与 after 同时指定，则只有 before 生效。
   *
   * 若与 after 都不指定，则插件将插入到列表末尾。
   */
  before?: string

  /**
   * 插入到指定名称插件之后。
   *
   * 若与 before 同时指定，则只有 before 生效。
   *
   * 若与 before 都不指定，则插件将插入到列表末尾。
   */
  after?: string
}
