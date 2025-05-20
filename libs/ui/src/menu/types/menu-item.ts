import type { Promisable } from '@v-md/shared'
import type { VNode } from 'vue'
import type { IconProps } from '../../icon'

export interface MenuItemProps {
  /** 渲染分隔线，为 true 时，其他选项均无效 */
  split?: boolean

  /**
   * 菜单项最左测小图标选项
   *
   * 为空代表不展示小图标
   */
  icon?: IconProps

  /** 菜单项左侧主文字内容 */
  label?: string

  /** 菜单项右侧快捷键文字内容。并不会真正绑定快捷键事件，只决定展示的文字内容 */
  keyBinding?: string

  /**
   * 菜单项右侧是否展示折叠箭头。
   *
   * 优先级高于 `keyBinding`，为 true 时，keyBinding 不展示
   */
  collapse?: boolean

  /** 是否激活 */
  active?: boolean

  /** 是否禁用 */
  disabled?: boolean

  /**
   * 子级下拉菜单内容，需要传递 VNode 渲染函数
   *
   * 支持异步加载
   */
  dropdown?: () => Promisable<VNode>

  /**
   * 是否展示子级下拉菜单。
   *
   * 该选项有效需要设置 `dropdown`
   *
   * @default
   */
  dropdownVisible?: boolean

  /** 点击触发 */
  onClick?: () => void

  /** 右键点击触发 */
  onRightClick?: () => void

  /** 鼠标悬停触发 */
  onHover?: () => void
}
