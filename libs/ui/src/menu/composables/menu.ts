import type { InjectionKey } from 'vue'
import type { MenuProps } from '../types'
import type { MenuItemContext } from './menu-item'
import {
  inject,
  provide,
  shallowReactive,
} from 'vue'

const MENU_PROVIDE_KEY = Symbol('menu') as InjectionKey<MenuContext>

export class MenuContext {
  static setup(props: Required<MenuProps>) {
    return new MenuContext(props)
  }

  static use() {
    const res = inject(MENU_PROVIDE_KEY)
    if (!res) {
      throw new Error('Can not find parent menu!')
    }
    return res
  }

  props: Required<MenuProps>

  constructor(props: Required<MenuProps>) {
    this.props = props
    provide(MENU_PROVIDE_KEY, this)
  }

  /** 子组件列表 */
  children = shallowReactive<MenuItemContext[]>([])

  /** 浮动窗触发计时器 */
  tippyTimer?: ReturnType<typeof setTimeout>
}
