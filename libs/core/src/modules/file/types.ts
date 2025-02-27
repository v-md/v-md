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
}

export interface KeyFileSet {
  /** 主文件，作为应用编译入口 */
  main?: FileNode

  /** 编辑入口文件 */
  index?: FileNode

  /** 依赖声明文件 */
  importMap?: FileNode

  /** 存放远程资源的文件目录 */
  nodeModules?: FileNode
}

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
