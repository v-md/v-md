import type { InjectionKey } from 'vue'
import type { MenuItemContext } from './menu-item'
import {
  inject,
  provide,
  shallowReactive,
} from 'vue'

const MENU_PROVIDE_KEY = Symbol('menu') as InjectionKey<MenuContext>

export class MenuContext {
  static setup() {
    return new MenuContext()
  }

  static use() {
    const res = inject(MENU_PROVIDE_KEY)
    if (!res) {
      throw new Error('Can not find parent menu!')
    }
    return res
  }

  constructor() {
    provide(MENU_PROVIDE_KEY, this)
  }

  /** 子组件列表 */
  children = shallowReactive<MenuItemContext[]>([])
}
