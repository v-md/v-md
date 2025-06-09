import type { InferVueDefaults } from '../../common'

export interface MenuProps {
  /**
   * 浮动窗触发延时
   *
   * 单位：毫秒
   *
   * @default 300
   */
  collapseDelay?: number
}

export function defaultMenuProps() {
  return {
    collapseDelay: 300,
  } satisfies InferVueDefaults<MenuProps>
}
