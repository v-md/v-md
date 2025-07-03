import type { InferVueDefaults } from '../../common'
import type { MenuContext } from '../composables'
import type Menu from '../views/menu.vue'

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

export interface MenuEmits {
  /**
   * 初始化事件
   * @param context 菜单上下文
   */
  setup: [context: MenuContext]
}

export type MenuInstance = InstanceType<typeof Menu>
