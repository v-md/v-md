import type { DynamicImportResolver, SetFieldType } from '@v-md/shared'
import type { Editor } from '../editor'

export interface ToolbarItemOptions {
  /**
   * 工具栏项的类型
   * - split: 渲染分割线
   * - button: 渲染按钮
   * - switch: 渲染开关，有 on/off 两种状态，对应 true / false 两种取值
   * - submenu: 渲染下拉菜单，每个菜单项可以配置点击事件
   * - select: 渲染下拉选择框，每个选项可以配置点击事件。同时该子项也会记录当前选中的值
   */
  type: 'split' | 'select' | 'switch' | 'button' | 'submenu'

  /** 当类型不为 split 时，应当设置选项的名称，不可与其他选项重复 */
  name?: string

  /** 选项的初始取值。 */
  value?: any

  /** 工具栏展示的小图标。空串代表不展示小图标。支持异步加载 */
  icon?: DynamicImportResolver<string>

  /**
   * 小图标的类型
   * @default 'svg'
   */
  iconType?: 'svg' | 'img'

  /**
   * 仅类型为 select / submenu 时有效，是否展示下拉箭头
   * @default false
   */
  showArrow?: boolean

  /**
   * 小图标右侧展示的文字
   * - 空串: 不展示文字
   * - 字符串：展示文字。其中 ${value} 会在类型为 select 时替换为当前选中的值
   * @default ''
   */
  text?: string

  /**
   * 若非空时，icon、showArrow、text 会被忽略，直接渲染该 html
   * @default ''
   */
  html?: string

  /**
   * 鼠标悬停时展示的提示文字。空串代表不展示提示文字
   * @default ''
   */
  tip?: string

  /**
   * 激活时触发的方法
   * @param editor 编辑器对象
   * @param value 触发时相关的取值
   * - 类型为 button 时，value 为 true / false
   * - 类型为 select / submenu 时，value 为对应选项的取值
   */
  onTrigger?: (editor: Editor, value: any) => void

  /** 仅类型为 select / submenu 时有效，下拉展示的选项列表 */
  options?: {
    /** 选项小图标。空串代表不展示小图标。支持异步加载 */
    icon?: DynamicImportResolver<string>

    /**
     * 小图标的类型
     * @default 'svg'
     */
    iconType?: 'svg' | 'img'

    /** 选项文字 */
    label?: string

    /** 若非空时，选项的 icon、label 会被忽略，直接渲染该 html */
    html?: string

    /** 选项的取值 */
    value: any
  }[]
}

export type ToolbarItemsSetting = ToolbarItemOptions | string

export interface ToolbarOptions {
  /**
   * 初始是否可见
   * @default true
   */
  visible?: boolean

  /** 初始子选项列表 */
  items?: ToolbarItemsSetting[]
}

export type ToolbarProps = SetFieldType<
  Required<ToolbarOptions>,
  'items',
  ToolbarItemOptions[]
>

export type ToolbarType = 'editor' | 'files' | 'preview'
