import type { SplitLayoutItemProps } from '../types'
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'
import { SplitLayoutContext } from './split-layout'
import { PanelSizeNormalizer, SizeUtils } from './utils'

interface SplitLayoutItemElement extends HTMLElement {
  _splitLayoutItemContext: SplitLayoutItemContext
}

/** Dom 元素的标记，必须与模板中绑定的 dataset 属性相对应 */
const DATASET_KEY = 'vmdSplitLayoutItem'

export class SplitLayoutItemContext {
  readonly splitLayout: SplitLayoutContext
  readonly props: Required<SplitLayoutItemProps>
  readonly itemEl = ref<SplitLayoutItemElement>()

  /** 子组件在组件列表中的索引 */
  index = -1

  /** 内部大小状态，用于拖拽时动态更新 */
  private readonly internalSize = ref<string>('')
  private readonly internalMinSize = ref<string>('')
  private readonly internalMaxSize = ref<string>('')

  constructor(props: Required<SplitLayoutItemProps>) {
    this.props = props
    this.splitLayout = SplitLayoutContext.use()

    // 仅在初始化时设置值，不再监听 props 变化（非响应性）
    this.internalSize.value = PanelSizeNormalizer.normalize(props.size)
    this.internalMinSize.value = PanelSizeNormalizer.normalize(props.minSize)
    this.internalMaxSize.value = PanelSizeNormalizer.normalize(props.maxSize)

    onMounted(() => {
      this.mount()
      this.applyConstraintsToSize()
    })

    onBeforeUnmount(() => {
      this.unmount()
    })
  }

  /** 获取当前大小 */
  get currentSize(): string {
    return this.internalSize.value
  }

  /** 获取当前最小大小 */
  get currentMinSize(): string {
    return this.internalMinSize.value
  }

  /** 获取当前最大大小 */
  get currentMaxSize(): string {
    return this.internalMaxSize.value
  }

  /** 更新大小 */
  updateSize(newSize: string): void {
    this.internalSize.value = newSize
    this.splitLayout.notifyResize()
  }

  mount() {
    const el = this.itemEl.value
    if (!el) {
      return
    }

    el._splitLayoutItemContext = this
    this.insertIntoItemList(el)
    this.scheduleLayoutUpdate()
  }

  unmount() {
    this.removeFromItemList()
    this.scheduleLayoutUpdate()
  }

  /** 插入到面板列表中 */
  private insertIntoItemList(el: SplitLayoutItemElement) {
    const prevItem = this.findPrevItem(el)
    const targetContext = prevItem?._splitLayoutItemContext
    const index = targetContext ? targetContext.index + 1 : 0

    this.splitLayout.items.splice(index, 0, this)
    this.index = index

    // 更新后续元素的索引
    this.updateSubsequentIndices(index)
  }

  /** 从面板列表中移除 */
  private removeFromItemList() {
    this.splitLayout.items.splice(this.index, 1)
    this.updateSubsequentIndices(this.index)
  }

  /** 更新后续元素的索引 */
  private updateSubsequentIndices(startIndex: number) {
    for (let i = startIndex; i < this.splitLayout.items.length; i++) {
      this.splitLayout.items[i].index = i
    }
  }

  /** 查找前一个面板元素 */
  private findPrevItem(el: HTMLElement): SplitLayoutItemElement | null {
    let cur = el.previousSibling
    while (cur) {
      if ((cur as any)?.dataset?.[DATASET_KEY]) {
        return cur as SplitLayoutItemElement
      }
      cur = cur.previousSibling
    }
    return null
  }

  /** 调度布局更新 */
  private scheduleLayoutUpdate() {
    // 延迟触发自动空间分配，确保所有变更都已完成
    this.splitLayout.scheduleAutoAllocateSpace()
    // 通知父组件更新
    this.splitLayout.notifyResize()
  }

  /** 应用约束条件到初始尺寸 */
  private applyConstraintsToSize() {
    if (!this.currentSize || !this.itemEl.value) {
      return
    }

    // 延迟执行以确保 DOM 已渲染
    setTimeout(() => {
      this.adjustSizeWithConstraints()
    }, 0)
  }

  /** 根据约束条件调整尺寸 */
  private adjustSizeWithConstraints() {
    const containerEl = this.itemEl.value?.parentElement
    if (!containerEl) {
      return
    }

    const isHorizontal = this.splitLayout.props.direction === 'horizontal'
    const containerSize = isHorizontal ? containerEl.clientWidth : containerEl.clientHeight

    // 将当前尺寸转换为像素值
    const currentPixels = SizeUtils.toPixels(this.currentSize, containerSize)
    let adjustedPixels = currentPixels

    // 应用最小尺寸约束
    if (this.currentMinSize) {
      const minPixels = SizeUtils.toPixels(this.currentMinSize, containerSize)
      adjustedPixels = Math.max(adjustedPixels, minPixels)
    }

    // 应用最大尺寸约束
    if (this.currentMaxSize) {
      const maxPixels = SizeUtils.toPixels(this.currentMaxSize, containerSize)
      adjustedPixels = Math.min(adjustedPixels, maxPixels)
    }

    // 如果调整后的尺寸与原尺寸不同，更新当前尺寸
    if (Math.abs(adjustedPixels - currentPixels) > 1) {
      const adjustedSize = SizeUtils.fromPixels(adjustedPixels, containerSize, this.currentSize)
      this.internalSize.value = adjustedSize
      this.scheduleLayoutUpdate()
    }
  }
}
