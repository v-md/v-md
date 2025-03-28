import type { DynamicImportResolver } from '@v-md/shared'
import type { Component } from 'vue'
import type { FileNode } from './file'

export interface FileOptions {
  /** 文件 / 目录名 */
  name?: string

  /**
   * 是否为目录
   * @default false
   */
  isFolder?: boolean

  /**
   * 核心文件标记。每种核心文件全局唯一，使用 api 多次创建同种标记的核心文件会使后者覆盖前者。
   * - 若取值为字符串，则为核心文件。核心文件是与编辑器的业务逻辑强相关的文件或目录。
   * - 若取值为 false，则表示非核心文件。
   * @default false
   */
  keyType?: keyof KeyFileSet | false

  /** isFolder = false 时，文件内容。 */
  content?: string

  /** isFolder = true 时，子文件选项 */
  children?: FileOptions[]

  /** 文件其他元数据 */
  meta?: FileMeta
}

export interface FileMeta extends Record<string, any> {}

export interface KeyFileSet {
  /** 工程根目录 */
  root?: FileNode

  /** 主文件，作为应用编译入口 */
  main?: FileNode

  /** 编辑入口文件 */
  index?: FileNode

  /** 依赖声明文件 */
  importMap?: FileNode

  /** 存放远程资源的文件目录 */
  nodeModules?: FileNode
}

/** 根据文件拓展名获取的文件信息 */
export interface FileExtInfo {
  /** 在文件管理页面展示的小图标 */
  icon?: DynamicImportResolver

  /** 小图标的颜色 */
  iconColor?: string

  /**
   * 对应 Monaco Editor 的语言标识
   * @default 'plaintext'
   */
  lang?: string

  /**
   * MIME 类型。参考：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/MIME_types
   *
   * 根据所配置的 MIME 类型的不同，编辑器会在文件上传场景时，采取不同的处理方式：
   * - text/*: 使用 `FileReader.readAsText` 读取文件内容
   * - 其他: 视为静态资源，使用 `FileReader.readAsDataURL` 读取文件内容，将读取到的 `dataURL` 作为文件的 content
   *
   * @default 'application/octet-stream'
   */
  mime?: string

  /**
   * 对应在 Editor 主区域展示的组件。取值规则如下：
   * - 'CodeEditor' - 使用默认的编辑器展示。当取值不为此时，切换到对应的文件，Monaco Editor 实例不会更新当前的 Model。
   * - Vue 组件 - 隐藏默认的编辑器，用对应的 Vue 组件展示
   * - null - 隐藏默认的编辑器，不展示任何内容，提示编辑器不支持该类型文件
   * @default 'CodeEditor'
   */
  editorComponent?: FileEditorComponentSetting
}

export type FileEditorComponentName = 'CodeEditor'
export type FileEditorComponentSetting = FileEditorComponentName | DynamicImportResolver<Component> | null
export type FileEditorComponentValue = FileEditorComponentName | Component | null

export type FileEvents = {
  /**
   * 当文件内容发生改变时触发
   * @param file 发生改变的文件
   * @param content 新内容
   * @param oldContent 旧内容
   */
  onChange: (file: FileNode, content: string, oldContent: string) => void

  /**
   * 当文件名称发生改变时触发
   * @param file 发生改变的文件
   * @param name 新名称
   * @param oldName 旧名称
   */
  onRename: (file: FileNode, name: string, oldName: string) => void

  /**
   * 当文件的位置发生改变时触发
   * @param file 发生改变的文件
   * @param parent 新父目录。删除文件场景时为 null
   * @param oldParent 旧父目录。新建文件场景时为 null
   */
  onMove: (file: FileNode, parent: FileNode | null, oldParent: FileNode | null) => void
}
