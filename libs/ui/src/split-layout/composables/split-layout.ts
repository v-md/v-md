import type { EmitFn, InjectionKey } from 'vue'
import type { NamespaceContext } from '../../config-provider'
import type { SplitLayoutEmits, SplitLayoutProps } from '../types'
import type { SplitLayoutItemContext } from './split-layout-item'
import type { SplitLayoutResizerContext } from './split-layout-resizer'
import { cssSizeToPixels, parseCssSize } from '@v-md/shared'
import {
  inject,
  onBeforeUnmount,
  provide,
  ref,
  shallowReactive,
} from 'vue'
import { useNamespace } from '../../config-provider'

const SPLIT_LAYOUT_PROVIDE_KEY = Symbol('split-layout') as InjectionKey<SplitLayoutContext>

export class SplitLayoutContext {
  static setup(props: Required<SplitLayoutProps>, emit: EmitFn<SplitLayoutEmits>) {
    return new SplitLayoutContext(props, emit)
  }

  static use() {
    const res = inject(SPLIT_LAYOUT_PROVIDE_KEY)
    if (!res) {
      throw new Error('Can not find parent split-layout!')
    }
    return res
  }

  readonly props: Required<SplitLayoutProps>
  readonly emit: EmitFn<SplitLayoutEmits>

  readonly namespace: NamespaceContext

  itemClassName(...names: string[]) {
    return this.namespace.c('split-layout', 'item', ...names)
  }

  resizerClassName(...names: string[]) {
    return this.namespace.c('split-layout', 'resizer', ...names)
  }

  /** 容器 DOM 元素 */
  readonly containerEl = ref<HTMLElement>()

  /** 面板列表 */
  readonly items = shallowReactive<SplitLayoutItemContext[]>([])

  /** 分割线列表 */
  readonly resizers = shallowReactive<SplitLayoutResizerContext[]>([])

  constructor(props: Required<SplitLayoutProps>, emit: EmitFn<SplitLayoutEmits>) {
    this.props = props
    this.emit = emit
    this.namespace = useNamespace()

    onBeforeUnmount(() => {
      this._clearAutoAllocateTimer()
    })

    provide(SPLIT_LAYOUT_PROVIDE_KEY, this)
  }

  private _autoAllocateTimer?: ReturnType<typeof setTimeout>

  /** 清理自动分配定时器 */
  private _clearAutoAllocateTimer() {
    if (this._autoAllocateTimer) {
      clearTimeout(this._autoAllocateTimer)
      this._autoAllocateTimer = undefined
    }
  }

  /** 获取当前所有面板的大小 */
  getSizes(): string[] {
    return this.items.map(item => item.currentSize)
  }

  /** 通知大小变化 */
  notifyResize() {
    this.emit('resize', this.getSizes())
  }

  /** 调度自动分配空间 */
  scheduleAutoAllocateSpace() {
    this._clearAutoAllocateTimer()
    this._autoAllocateTimer = setTimeout(() => {
      this.autoAllocateSpace()
      this._autoAllocateTimer = undefined
    }, 0)
  }

  /** 获取容器信息 */
  private getContainerInfo() {
    const containerEl = this.items[0]?.itemEl.value?.parentElement
    if (!containerEl) {
      return null
    }

    const isHorizontal = this.props.direction === 'horizontal'
    const containerSize = isHorizontal ? containerEl.clientWidth : containerEl.clientHeight

    if (containerSize <= 0) {
      return null
    }

    return { containerEl, containerSize, isHorizontal }
  }

  /** 计算分割线占用的总空间 */
  private calculateResizerTotalSize(): number {
    return this.resizers.reduce((total, resizer) => {
      const { size } = resizer.props

      if (typeof size === 'number') {
        return total + size
      }

      if (typeof size === 'string') {
        const parsed = parseCssSize(size)
        return total + (parsed?.value || 0)
      }

      return total
    }, 0)
  }

  /** 分离固定大小和自动分配的面板 */
  private categorizeItems() {
    const autoItems: SplitLayoutItemContext[] = []
    const fixedItems: SplitLayoutItemContext[] = []

    for (const item of this.items) {
      if (!item.currentSize) {
        autoItems.push(item)
      }
      else {
        fixedItems.push(item)
      }
    }

    return { autoItems, fixedItems }
  }

  /** 自动分配空间 */
  private autoAllocateSpace() {
    if (this.items.length === 0) {
      return
    }

    const { autoItems, fixedItems } = this.categorizeItems()
    if (autoItems.length === 0) {
      return
    }

    // 所有面板都需要自动分配
    if (fixedItems.length === 0) {
      this.allocateEqualSpace(autoItems)
      return
    }

    const containerInfo = this.getContainerInfo()
    if (!containerInfo) {
      this.allocateSpaceWithoutContainer(autoItems, fixedItems)
      return
    }

    this.allocateSpaceWithContainer(autoItems, fixedItems, containerInfo)
  }

  /** 平均分配空间 */
  private allocateEqualSpace(items: SplitLayoutItemContext[]) {
    const averagePercentage = 100 / items.length

    items.forEach((item, index) => {
      const size = index === items.length - 1 ?
        `${100 - averagePercentage * index}%` : // 最后一个使用剩余空间
        `${averagePercentage}%`
      item.updateSize(size)
    })
  }

  /** 基于容器尺寸分配空间 */
  private allocateSpaceWithContainer(
    autoItems: SplitLayoutItemContext[],
    fixedItems: SplitLayoutItemContext[],
    { containerSize }: { containerSize: number },
  ) {
    const resizerTotalSize = this.calculateResizerTotalSize()

    // 计算固定面板占用的像素
    const fixedPixels = fixedItems.reduce((total, item) => {
      return total + cssSizeToPixels(item.currentSize, containerSize)
    }, 0)

    // 计算可用空间
    const availablePixels = Math.max(0, containerSize - fixedPixels - resizerTotalSize)

    // 空间不足时的处理
    if (availablePixels < autoItems.length * 10) {
      const minSize = Math.max(1, Math.floor(availablePixels / autoItems.length))
      autoItems.forEach(item => item.updateSize(`${minSize}px`))
      return
    }

    // 平分可用空间
    const autoSizePixels = availablePixels / autoItems.length
    autoItems.forEach((item, index) => {
      const size = index === autoItems.length - 1 ?
        `${availablePixels - autoSizePixels * index}px` : // 最后一个使用剩余空间
        `${autoSizePixels}px`
      item.updateSize(size)
    })
  }

  /** 不基于容器尺寸的降级分配 */
  private allocateSpaceWithoutContainer(
    autoItems: SplitLayoutItemContext[],
    fixedItems: SplitLayoutItemContext[],
  ) {
    // 计算固定面板占用的百分比
    const fixedPercentage = fixedItems.reduce((total, item) => {
      const size = item.currentSize
      if (size.endsWith('%')) {
        return total + Number.parseFloat(size)
      }
      // 混合单位警告
      if (size.endsWith('px') || !Number.isNaN(Number.parseFloat(size))) {
        console.warn('[SplitLayout] Mixed px and auto sizing may cause layout issues. Consider using consistent units.')
      }
      return total
    }, 0)

    // 计算剩余空间
    const remainingPercentage = Math.max(0, Math.min(100, 100 - fixedPercentage))

    if (autoItems.length === 0 || remainingPercentage <= 0) {
      return
    }

    // 平分剩余空间
    const autoPercentage = remainingPercentage / autoItems.length
    autoItems.forEach((item, index) => {
      const size = index === autoItems.length - 1 ?
        `${remainingPercentage - autoPercentage * index}%` : // 最后一个使用剩余空间
        `${autoPercentage}%`
      item.updateSize(size)
    })
  }
}
