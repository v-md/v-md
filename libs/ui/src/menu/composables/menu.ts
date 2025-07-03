import type {
  ComponentInternalInstance,
  EmitFn,
  InjectionKey,
} from 'vue'
import type { MenuEmits, MenuProps } from '../types'
import type { MenuItemContext } from './menu-item'
import { isObjectLike } from '@v-md/shared'
import {
  inject,
  provide,
  shallowReactive,
} from 'vue'

const MENU_PROVIDE_KEY = Symbol('menu') as InjectionKey<MenuContext>

export class MenuContext {
  static setup(props: Required<MenuProps>, emit: EmitFn<MenuEmits>) {
    return new MenuContext(props, emit)
  }

  static use() {
    const res = inject(MENU_PROVIDE_KEY)
    if (!res) {
      throw new Error('Can not find parent menu!')
    }
    return res
  }

  readonly props: Required<MenuProps>
  readonly emit: EmitFn<MenuEmits>

  constructor(props: Required<MenuProps>, emit: EmitFn<MenuEmits>) {
    this.props = props
    this.emit = emit
    emit('setup', this)
    provide(MENU_PROVIDE_KEY, this)
  }

  /**
   * 有时 `Menu` 组件与 `MenuItem` 并不为父子组件(Teleport场景)，需要手动设置上下文
   */
  setProvide(instance?: ComponentInternalInstance | null) {
    const provides = (instance as any)?.provides as Record<string | symbol, any>
    if (isObjectLike(provides)) {
      provides[MENU_PROVIDE_KEY] = this
    }
  }

  /** 子组件列表 */
  children = shallowReactive<MenuItemContext[]>([])

  /** 浮动窗触发计时器 */
  tippyTimer?: ReturnType<typeof setTimeout>
}
