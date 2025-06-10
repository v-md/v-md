import type { InjectionKey, Ref } from 'vue'
import type { SplitLayoutProps } from '../types'
import {
  inject,
  provide,
  shallowReactive,
} from 'vue'

// 前向声明，避免循环导入
export interface SplitLayoutItemContext {
  index: number
  itemEl: Ref<HTMLElement | undefined>
  currentSize: string
  currentMinSize: string
  currentMaxSize: string
  updateSize: (newSize: string) => void
}

export interface SplitLayoutResizerContext {
  props: { disabled?: boolean, size?: string }
  index: number
  isResizing: { value: boolean }
  resizerEl: Ref<HTMLElement | undefined>
}

const SPLIT_LAYOUT_PROVIDE_KEY = Symbol('split-layout') as InjectionKey<SplitLayoutContext>

export class SplitLayoutContext {
  static setup(props: Required<SplitLayoutProps>) {
    return new SplitLayoutContext(props)
  }

  static use() {
    const res = inject(SPLIT_LAYOUT_PROVIDE_KEY)
    if (!res) {
      throw new Error('Can not find parent split-layout!')
    }
    return res
  }

  props: Required<SplitLayoutProps>

  constructor(props: Required<SplitLayoutProps>) {
    this.props = props
    provide(SPLIT_LAYOUT_PROVIDE_KEY, this)
  }

  /** 子项列表 */
  items = shallowReactive<SplitLayoutItemContext[]>([])

  /** 分割线列表 */
  resizers = shallowReactive<SplitLayoutResizerContext[]>([])

  /** 获取当前所有面板的大小 */
  getSizes(): string[] {
    return this.items.map(item => item.currentSize)
  }

  /** 触发 resize 事件 */
  emitResize?: (sizes: string[]) => void

  /** 注册 resize 事件处理器 */
  onResize(handler: (sizes: string[]) => void) {
    this.emitResize = handler
  }

  /** 通知大小变化 */
  notifyResize() {
    if (this.emitResize) {
      this.emitResize(this.getSizes())
    }
  }
}
