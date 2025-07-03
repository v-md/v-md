import type { CSSProperties, TeleportProps } from 'vue'
import type { InferVueDefaults } from '../../common'

export type TabDirection = 'vertical' | 'horizontal'

export interface TabProps {
  /**
   * 布局方向
   * @default 'vertical'
   */
  direction?: TabDirection

  /**
   * 布局间隙
   *
   * 支持以下类型：
   * - string: 支持 CSS 单位，但仅限 px 单位，如 '4px'
   * - number: 数字类型，默认单位为 px，如 4 等价于 '4px'
   *
   * @default 0
   */
  gap?: string | number

  /**
   * 宽度不足时，禁止折叠
   * @default false
   */
  disableCollapse?: boolean

  /**
   * 折叠时，折叠元素的类名
   * @default []
   */
  collapseClass?: string | string[]

  /**
   * 折叠时，折叠元素的样式
   * @default {}
   */
  collapseStyle?: CSSProperties

  /**
   * 折叠时，折叠元素的触发方式
   * @default 'click'
   */
  collapseTrigger?: 'click' | 'hover'

  /**
   * panel 面板的 Teleport 目标，如果为空，则 panel 插槽不可用，子面板不展示
   * @default null
   */
  panelTeleportTo?: TeleportProps['to']
}

export function defaultTabProps() {
  return {
    direction: 'horizontal',
    gap: 0,
    disableCollapse: false,
    collapseClass: () => [],
    collapseStyle: () => ({}),
    collapseTrigger: 'click',
    panelTeleportTo: null,
  } satisfies InferVueDefaults<TabProps>
}

export interface TabModel {
  /** 当前激活的 tab-item 子项的值 */
  modelValue: any
}
