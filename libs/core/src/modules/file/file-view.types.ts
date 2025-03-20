import type { PluginInsertOptions } from '../plugin'
import type { FileNode } from './file'
import type { FileManagerView } from './manager-view'

/** 文件管理右键菜单配置 */
export interface FileNavMenuOptions {
  /** 菜单名称标识 */
  name: string

  /** 菜单主文字 */
  label: string

  /** 菜单快捷键文字。需要设置快捷键触发后才展示 */
  keyboardLabel?: string

  /**
   * 菜单快捷键触发规则。若不设置代表不可通过快捷键触发
   * @param keys 当前按下的键列表，成员为 KeyboardEvent.code
   * @returns 若返回文件节点，则在该节点上触发事件。若返回 null，则条件不满足，不触发
   */
  keyboard?: (view: FileManagerView) => FileNode | null

  /** 在纯预览模式下可用 */
  enabledInViewMode?: boolean

  /**
   * 菜单可用条件。若不设置函数代表持续可用
   * @param file 当前右键的文件
   * @returns 是否展示
   */
  enable?: (file: FileNode) => boolean

  /**
   * 菜单触发行为
   * @param file 当前右键的文件
   */
  onTrigger?: (file: FileNode) => void
}

export type FileNavMenuItem = FileNavMenuOptions | '-'

export interface FileNavMenuItemAddOptions extends PluginInsertOptions {}

export interface FileNavMenuConfirmOptions {
  /** 确认弹框消息，支持 HTML */
  message?: string

  /**
   * 确认按钮文字
   * @default '是'
   */
  confirmLabel?: string

  /**
   * 取消按钮文字
   * @default '否'
   */
  cancelLabel?: string

  /** 确认按钮点击回调 */
  onConfirm?: () => void

  /** 取消按钮点击回调 */
  onCancel?: () => void
}
