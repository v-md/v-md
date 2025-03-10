import type { ViewerOptions } from '@v-md/renderer'
import type { editor } from 'monaco-editor-core'
import type { LayoutProps } from '../../views/layout'
import type { ToolbarOptions } from '../toolbar'
import type { Editor } from './editor'

export interface EditorOptions {
  /** 编辑器内容。不传则展示初始模板 */
  value?: string

  /** 编辑器注册插件的钩子，可以在其中获取编辑器实例，注册插件。插件不支持异步注册 */
  plugins?: (editor: Editor) => void

  /** 头部标题栏配置。初始化时生效，后续改写配置不会动态响应 */
  toolbars?: {
    /** 编辑部分标题栏配置 */
    editor?: ToolbarOptions

    /** 文件目录部分标题栏配置 */
    files?: ToolbarOptions

    /** 预览部分标题栏配置 */
    preview?: ToolbarOptions
  }

  /** 编辑器根元素的 HTML 属性 */
  attrs?: LayoutProps & Record<string, any>

  /** 传递给 Monaco Editor 实例相关选项 */
  monacoOptions?: editor.IStandaloneEditorConstructionOptions

  /**
   * 远程加载 npm 依赖资源的地址
   * @default 'https://cdn.jsdelivr.net/npm'
   */
  cdnUrl?: string

  /**
   * 远程加载 cdn 相关数据的地址。jsdelivr 需要通过此 url 获取 npm 包的元数据；unpkg 暂不需要设置
   *
   * Monaco Editor 语言服务需要设置此字段
   * @default 'https://data.jsdelivr.com/v1'
   */
  cdnDataUrl?: string

  /**
   * npm 依赖资源的类型。Monaco Editor 的语言服务需要设置此字段
   * @default 'unpkg'
   */
  cdnType?: 'unpkg' | 'jsdelivr'

  /**
   * 国际化语言
   * @default ''
   */
  locale?: string

  /** 预览相关配置 */
  previewOptions?: ViewerOptions['previewOptions']
}
