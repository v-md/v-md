import type { LiHTMLAttributes } from 'vue'
import type { IconPropsWithAttrs } from '../../icon'

export interface MenuItemProps {
  /** 渲染分隔线，为 true 时，其他选项均无效 */
  split?: boolean

  /**
   * 菜单项最左测小图标选项
   *
   * 为空代表不展示小图标
   */
  icon?: IconPropsWithAttrs

  /** 菜单项左侧主文字内容 */
  label?: string

  /** 菜单项右侧快捷键文字内容。并不会真正绑定快捷键事件，只决定展示的文字内容 */
  keyBinding?: string

  /**
   * 菜单项右侧的折叠箭头
   * - object: 显示折叠箭头，对象将作为 `Icon` 组件的属性传入
   * - true: 展示默认的折叠箭头
   * - false: 不展示折叠箭头
   */
  collapseIcon?: IconPropsWithAttrs | boolean

  /**
   * 折叠浮动窗的触发方式：
   * - 'none' | undefined: 禁用折叠浮动窗
   * - 'hover': 鼠标悬停时触发
   * - 'click': 点击后触发
   * @default 'none'
   */
  collapseTrigger?: 'hover' | 'click' | 'none'

  /** 是否禁用 */
  disabled?: boolean

  /** 是否隐藏 */
  hidden?: boolean
}

export type MenuItemPropsWithAttrs = MenuItemProps & LiHTMLAttributes
export interface MenuItemEmits {
  /** 鼠标覆盖时触发 */
  (e: 'hover'): void
}

export interface MenuItemSlots {
  /** 默认插槽，弹出浮动窗中的内容 */
  default: () => any
}
