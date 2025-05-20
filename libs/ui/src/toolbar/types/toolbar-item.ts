import type { Promisable } from '@v-md/shared'
import type { VNode } from 'vue'
import type { IconProps } from '../../icon'

export interface ToolbarItemProps {
  /**
   * 渲染分隔线，为 true 时，其他选项均无效
   * @default false
   */
  split?: boolean

  /**
   * 工具栏展示的小图标的配置选项
   *
   * 为空代表不展示小图标
   */
  icon?: IconProps

  /**
   * 小图标右侧展示文字
   *
   * 为空代表不展示文字
   */
  label?: string

  /**
   * 文字与小图标右侧，是否展示下拉箭头
   * @default false
   */
  arrow?: boolean

  /**
   * 是否激活
   * @default false
   */
  active?: boolean

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 鼠标悬停时提示文字
   *
   * 为空代表不展示提示文字
   *
   * 若设置了 `dropdown`，该选项无效
   */
  tip?: string

  /**
   * 是否展示提示文字
   *
   * 该选项有效的条件：
   * - `tip` 选项有效
   * - 未设置 `dropdown`
   * @default false
   */
  tipVisible?: boolean

  /**
   * 下拉菜单内容，需要传递 VNode 渲染函数
   *
   * 支持异步加载
   */
  dropdown?: () => Promisable<VNode>

  /**
   * 是否展示下拉菜单。
   *
   * 该选项有效需要设置 `dropdown`
   *
   * 优先级高于 `tipVisible`
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
