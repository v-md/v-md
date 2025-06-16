import type {
  EmitFn,
} from 'vue'
import type { SplitLayoutResizerEmits, SplitLayoutResizerProps } from '../types'
import type { SplitLayoutItemContext, SplitLayoutItemElement } from './split-layout-item'
import { camelCase, clamp, cssSizeToPixels } from '@v-md/shared'
import { findSiblingWithDataset } from '@v-md/shared/browser'
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'
import { SplitLayoutContext } from './split-layout'
import { SizeUtils } from './utils'

interface SplitLayoutResizerElement extends HTMLElement {
  _splitLayoutResizerContext: SplitLayoutResizerContext
}

/**
 * 拖拽状态管理类
 */
class DragState {
  readonly isHorizontal: boolean
  readonly startPosition: number
  readonly containerSize: number
  readonly prevItem: SplitLayoutItemContext
  readonly nextItem: SplitLayoutItemContext
  readonly initialPrevSize: string
  readonly initialNextSize: string
  readonly initialPrevPixels: number
  readonly initialNextPixels: number
  readonly constraints: {
    prevMinPixels: number
    nextMinPixels: number
    prevMaxPixels: number
    nextMaxPixels: number
  }

  constructor(
    isHorizontal: boolean,
    startPosition: number,
    containerSize: number,
    prevItem: SplitLayoutItemContext,
    nextItem: SplitLayoutItemContext,
  ) {
    this.isHorizontal = isHorizontal
    this.startPosition = startPosition
    this.containerSize = containerSize
    this.prevItem = prevItem
    this.nextItem = nextItem
    this.initialPrevSize = prevItem.currentSize
    this.initialNextSize = nextItem.currentSize

    // 获取元素的实际渲染尺寸，而不是仅基于 currentSize 计算
    this.initialPrevPixels = this.getActualElementSize(prevItem.itemEl.value, isHorizontal) ||
      cssSizeToPixels(this.initialPrevSize, containerSize)
    this.initialNextPixels = this.getActualElementSize(nextItem.itemEl.value, isHorizontal) ||
      cssSizeToPixels(this.initialNextSize, containerSize)

    // 计算约束条件
    this.constraints = {
      prevMinPixels: prevItem.currentMinSize ?
          cssSizeToPixels(prevItem.currentMinSize, containerSize) :
        10,
      nextMinPixels: nextItem.currentMinSize ?
          cssSizeToPixels(nextItem.currentMinSize, containerSize) :
        10,
      prevMaxPixels: prevItem.currentMaxSize ?
          cssSizeToPixels(prevItem.currentMaxSize, containerSize) :
        Infinity,
      nextMaxPixels: nextItem.currentMaxSize ?
          cssSizeToPixels(nextItem.currentMaxSize, containerSize) :
        Infinity,
    }
  }

  /**
   * 获取元素的实际渲染尺寸
   */
  private getActualElementSize(element: HTMLElement | undefined, isHorizontal: boolean): number | null {
    if (!element) {
      return null
    }

    return isHorizontal ? element.offsetWidth : element.offsetHeight
  }

  /**
   * 根据移动量计算新的面板大小
   */
  calculateNewSizes(delta: number): { prevPixels: number, nextPixels: number } {
    // 计算期望的新尺寸
    const targetPrevPixels = this.initialPrevPixels + delta
    const targetNextPixels = this.initialNextPixels - delta

    // 应用约束条件
    const constrainedPrevPixels = clamp(
      targetPrevPixels,
      this.constraints.prevMinPixels,
      this.constraints.prevMaxPixels,
    )

    const constrainedNextPixels = clamp(
      targetNextPixels,
      this.constraints.nextMinPixels,
      this.constraints.nextMaxPixels,
    )

    // 检查哪个约束更严格，以此来确定实际的移动量
    const prevConstraintDelta = constrainedPrevPixels - this.initialPrevPixels
    const nextConstraintDelta = constrainedNextPixels - this.initialNextPixels

    // 选择更严格的约束作为最终的移动量
    let finalDelta: number

    if (delta > 0) {
      // 向右拖拽：prev增大，next减小
      finalDelta = Math.min(
        prevConstraintDelta, // prev能增大的最大量
        -nextConstraintDelta, // next能减小的最大量（取负值）
      )
    }
    else {
      // 向左拖拽：prev减小，next增大
      finalDelta = Math.max(
        prevConstraintDelta, // prev能减小的最大量（负值）
        -nextConstraintDelta, // next能增大的最大量的负值
      )
    }

    // 根据最终的移动量计算新尺寸
    const finalPrevPixels = this.initialPrevPixels + finalDelta
    const finalNextPixels = this.initialNextPixels - finalDelta

    // console.log('delta:', delta, 'finalDelta:', finalDelta, 'prev:', finalPrevPixels, 'next:', finalNextPixels)
    return { prevPixels: finalPrevPixels, nextPixels: finalNextPixels }
  }

  /**
   * 更新面板大小
   */
  updatePanelSizes(prevPixels: number, nextPixels: number): void {
    const newPrevSize = SizeUtils.fromPixels(prevPixels, this.containerSize, this.initialPrevSize)
    const newNextSize = SizeUtils.fromPixels(nextPixels, this.containerSize, this.initialNextSize)

    this.prevItem.updateSize(newPrevSize)
    this.nextItem.updateSize(newNextSize)
  }
}

export class SplitLayoutResizerContext {
  readonly layout: SplitLayoutContext
  readonly props: Required<SplitLayoutResizerProps>
  readonly emit: EmitFn<SplitLayoutResizerEmits>
  readonly resizerEl = ref<SplitLayoutResizerElement>()
  readonly isResizing = ref(false)

  /** 子组件在组件列表中的索引 */
  index = -1

  /** dataset 属性 */
  get datasetKey() {
    return camelCase(this.layout.resizerClassName())
  }

  /** 模板绑定的 dataset 属性 */
  get datasetTemplateKey() {
    return `data-${this.layout.resizerClassName()}`
  }

  /** 当前的拖拽状态 */
  private dragState: DragState | null = null

  /** 事件监听器清理函数 */
  private eventCleanup: (() => void) | null = null

  constructor(props: Required<SplitLayoutResizerProps>, emit: EmitFn<SplitLayoutResizerEmits>) {
    this.props = props
    this.emit = emit
    this.layout = SplitLayoutContext.use()

    onMounted(() => {
      this.mount()
    })

    onBeforeUnmount(() => {
      this.unmount()
    })
  }

  mount() {
    const el = this.resizerEl.value
    if (!el) {
      return
    }

    el._splitLayoutResizerContext = this
    this.insertIntoResizerList(el)
  }

  unmount() {
    this.removeFromResizerList()
    this.clearEventListeners()
  }

  /** 插入到分割线列表中 */
  private insertIntoResizerList(el: SplitLayoutResizerElement) {
    const prevResizer = findSiblingWithDataset<SplitLayoutResizerElement>(el, 'previousSibling', this.datasetKey)
    const targetContext = prevResizer?._splitLayoutResizerContext
    const index = targetContext ? targetContext.index + 1 : 0

    this.layout.resizers.splice(index, 0, this)
    this.index = index

    // 更新后续元素的索引
    this.updateSubsequentIndices(index)
  }

  /** 从分割线列表中移除 */
  private removeFromResizerList() {
    this.layout.resizers.splice(this.index, 1)
    this.updateSubsequentIndices(this.index)
  }

  /** 更新后续元素的索引 */
  private updateSubsequentIndices(startIndex: number) {
    for (let i = startIndex; i < this.layout.resizers.length; i++) {
      this.layout.resizers[i].index = i
    }
  }

  /** 查找相邻的面板项 */
  private findAdjacentItems(): { prevItem: SplitLayoutItemContext, nextItem: SplitLayoutItemContext } | null {
    if (!this.resizerEl.value) {
      return null
    }

    const prevEl = findSiblingWithDataset<SplitLayoutItemElement>(
      this.resizerEl.value,
      'previousSibling',
      camelCase(this.layout.itemClassName()),
    )
    const nextEl = findSiblingWithDataset<SplitLayoutItemElement>(
      this.resizerEl.value,
      'nextSibling',
      camelCase(this.layout.itemClassName()),
    )

    const prevItem = prevEl?._splitLayoutItemContext
    const nextItem = nextEl?._splitLayoutItemContext

    if (!prevItem || !nextItem) {
      console.warn('[SplitLayout] Cannot find adjacent panels for resizer')
      return null
    }

    return { prevItem, nextItem }
  }

  /** 获取容器信息 */
  private getContainerInfo() {
    const containerEl = this.layout.items[0]?.itemEl.value?.parentElement
    if (!containerEl) {
      return null
    }

    const isHorizontal = this.layout.props.direction === 'horizontal'
    const containerSize = isHorizontal ? containerEl.clientWidth : containerEl.clientHeight

    return { containerEl, containerSize, isHorizontal }
  }

  /** 清理事件监听器 */
  private clearEventListeners() {
    if (this.eventCleanup) {
      this.eventCleanup()
      this.eventCleanup = null
    }
  }

  getEventPosition(event: MouseEvent | TouchEvent, isHorizontal: boolean): number {
    const isTouch = 'touches' in event
    const clientEvent = isTouch ? event.touches[0] : event
    return isHorizontal ? clientEvent.clientX : clientEvent.clientY
  }

  /** 创建移动事件处理器 */
  private createMoveHandler(): (event: MouseEvent | TouchEvent) => void {
    return (moveEvent: MouseEvent | TouchEvent) => {
      if (!this.isResizing.value || !this.dragState) {
        return
      }

      const currentPosition = this.getEventPosition(moveEvent, this.dragState.isHorizontal)
      const delta = currentPosition - this.dragState.startPosition

      const { prevPixels, nextPixels } = this.dragState.calculateNewSizes(delta)
      this.dragState.updatePanelSizes(prevPixels, nextPixels)
    }
  }

  /** 创建结束事件处理器 */
  private createEndHandler(): () => void {
    return () => {
      if (!this.isResizing.value) {
        return
      }

      this.isResizing.value = false
      this.dragState = null

      this.clearEventListeners()

      this.emit('resize-end')
    }
  }

  /** 开始拖拽 */
  startResize(event: MouseEvent | TouchEvent) {
    if (this.props.disabled) {
      return
    }

    event.preventDefault()

    this.emit('resize-start')

    // 获取容器信息
    const containerInfo = this.getContainerInfo()
    if (!containerInfo) {
      return
    }

    // 查找相邻面板
    const adjacentItems = this.findAdjacentItems()
    if (!adjacentItems) {
      this.isResizing.value = false
      return
    }

    const { containerSize, isHorizontal } = containerInfo
    const { prevItem, nextItem } = adjacentItems
    const startPosition = this.getEventPosition(event, isHorizontal)

    // 创建拖拽状态
    this.dragState = new DragState(isHorizontal, startPosition, containerSize, prevItem, nextItem)
    this.isResizing.value = true

    // 清理之前的事件监听器
    this.clearEventListeners()

    // 创建事件处理器
    const handleMove = this.createMoveHandler()
    const handleEnd = this.createEndHandler()

    // 注册事件监听器并保存清理函数
    this.eventCleanup = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }

    // 立即添加事件监听器
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)
  }
}
