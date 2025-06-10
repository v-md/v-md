import type { SplitLayoutResizerProps } from '../types'
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'
import { type SplitLayoutResizerContext as ISplitLayoutResizerContext, SplitLayoutContext } from './split-layout'

interface SplitLayoutResizerElement extends HTMLElement {
  _splitLayoutResizerContext: SplitLayoutResizerContext
}

/** Dom 元素的标记，必须与模板中绑定的 dataset 属性相对应 */
const DATASET_KEY = 'vmdSplitLayoutResizer'

export class SplitLayoutResizerContext implements ISplitLayoutResizerContext {
  splitLayout: SplitLayoutContext
  props: Required<SplitLayoutResizerProps>

  /** 子组件在组件列表中的索引 */
  index = -1

  /** 子组件主元素引用 */
  resizerEl = ref<SplitLayoutResizerElement>()

  /** 是否正在拖拽 */
  isResizing = ref(false)

  constructor(props: Required<SplitLayoutResizerProps>) {
    this.props = props
    this.splitLayout = SplitLayoutContext.use()

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
    const prevResizer = this.findPrevResizer()
    const targetContext = prevResizer?._splitLayoutResizerContext
    const index = targetContext ? targetContext.index + 1 : 0
    this.splitLayout.resizers.splice(index, 0, this)
    this.index = index

    for (let i = index + 1; i < this.splitLayout.resizers.length; i++) {
      this.splitLayout.resizers[i].index = i
    }
  }

  unmount() {
    const el = this.resizerEl.value
    if (!el) {
      return
    }

    this.splitLayout.resizers.splice(this.index, 1)

    for (let i = this.index; i < this.splitLayout.resizers.length; i++) {
      this.splitLayout.resizers[i].index = i
    }
  }

  findPrevResizer() {
    if (!this.resizerEl.value) {
      return null
    }

    let cur = this.resizerEl.value.previousSibling
    while (cur) {
      if ((cur as any)?.dataset?.[DATASET_KEY]) {
        return cur as SplitLayoutResizerElement
      }
      cur = cur.previousSibling
    }
    return null
  }

  /** 结束拖拽事件回调 */
  onResizeEnd?: () => void

  /** 注册结束拖拽事件处理器 */
  setResizeEndHandler(handler: () => void) {
    this.onResizeEnd = handler
  }

  /** 解析尺寸值为像素值 */
  private parseSizeToPixels(size: string, containerSize: number): number {
    if (!size)
      return 0

    if (size.endsWith('px')) {
      return Number.parseFloat(size)
    }
    else if (size.endsWith('%')) {
      return (Number.parseFloat(size) / 100) * containerSize
    }
    else if (size.endsWith('fr')) {
      // fr 单位比较复杂，这里简化处理，假设平均分配
      return containerSize / this.splitLayout.items.length
    }
    else {
      // 纯数字，当作像素处理
      const num = Number.parseFloat(size)
      return Number.isNaN(num) ? 0 : num
    }
  }

  /** 像素值转换为指定单位 */
  private pixelsToSize(pixels: number, containerSize: number, originalSize: string): string {
    if (!originalSize)
      return `${pixels}px`

    if (originalSize.endsWith('%')) {
      return `${(pixels / containerSize) * 100}%`
    }
    else if (originalSize.endsWith('fr')) {
      // fr 单位保持原有值，简化处理
      return originalSize
    }
    else {
      // 默认使用像素
      return `${pixels}px`
    }
  }

  /** 开始拖拽 */
  startResize(event: MouseEvent | TouchEvent) {
    if (this.props.disabled) {
      return
    }

    event.preventDefault()
    this.isResizing.value = true

    const isHorizontal = this.splitLayout.props.direction === 'horizontal'
    const startPosition = this.getEventPosition(event, isHorizontal)

    // 获取相邻的两个面板
    const prevItem = this.splitLayout.items[this.index]
    const nextItem = this.splitLayout.items[this.index + 1]

    if (!prevItem || !nextItem) {
      return
    }

    const containerEl = this.splitLayout.items[0]?.itemEl.value?.parentElement
    if (!containerEl) {
      return
    }

    const containerSize = isHorizontal ?
      containerEl.clientWidth :
      containerEl.clientHeight

    // 记录初始状态
    const initialPrevSize = prevItem.currentSize
    const initialNextSize = nextItem.currentSize
    const initialPrevPixels = this.parseSizeToPixels(initialPrevSize, containerSize)
    const initialNextPixels = this.parseSizeToPixels(initialNextSize, containerSize)

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!this.isResizing.value) {
        return
      }

      const currentPosition = this.getEventPosition(moveEvent, isHorizontal)
      const delta = currentPosition - startPosition

      // 计算大小限制
      const prevMinPixels = prevItem.currentMinSize ?
          this.parseSizeToPixels(prevItem.currentMinSize, containerSize) :
        10 // 默认最小10px
      const nextMinPixels = nextItem.currentMinSize ?
          this.parseSizeToPixels(nextItem.currentMinSize, containerSize) :
        10 // 默认最小10px

      const prevMaxPixels = prevItem.currentMaxSize ?
          this.parseSizeToPixels(prevItem.currentMaxSize, containerSize) :
        Infinity
      const nextMaxPixels = nextItem.currentMaxSize ?
          this.parseSizeToPixels(nextItem.currentMaxSize, containerSize) :
        Infinity

      // 计算目标大小
      let targetPrevPixels = initialPrevPixels + delta
      let targetNextPixels = initialNextPixels - delta

      // 应用大小限制
      targetPrevPixels = Math.max(prevMinPixels, Math.min(prevMaxPixels, targetPrevPixels))
      targetNextPixels = Math.max(nextMinPixels, Math.min(nextMaxPixels, targetNextPixels))

      // 确保总大小保持不变
      const totalPixels = targetPrevPixels + targetNextPixels
      const targetTotal = initialPrevPixels + initialNextPixels

      if (Math.abs(totalPixels - targetTotal) > 1) {
        const diff = targetTotal - totalPixels

        // 尝试调整以保持总大小不变
        if (diff > 0) {
          // 需要增加总大小
          if (targetPrevPixels < prevMaxPixels) {
            const canIncrease = Math.min(diff, prevMaxPixels - targetPrevPixels)
            targetPrevPixels += canIncrease
          }
          if (targetNextPixels < nextMaxPixels && Math.abs(targetPrevPixels + targetNextPixels - targetTotal) > 1) {
            const remaining = targetTotal - targetPrevPixels
            targetNextPixels = Math.min(nextMaxPixels, remaining)
          }
        }
        else {
          // 需要减少总大小
          if (targetPrevPixels > prevMinPixels) {
            const canDecrease = Math.min(Math.abs(diff), targetPrevPixels - prevMinPixels)
            targetPrevPixels -= canDecrease
          }
          if (targetNextPixels > nextMinPixels && Math.abs(targetPrevPixels + targetNextPixels - targetTotal) > 1) {
            const remaining = targetTotal - targetPrevPixels
            targetNextPixels = Math.max(nextMinPixels, remaining)
          }
        }
      }

      const newPrevPixels = targetPrevPixels
      const newNextPixels = targetNextPixels

      prevItem.updateSize(this.pixelsToSize(newPrevPixels, containerSize, initialPrevSize))
      nextItem.updateSize(this.pixelsToSize(newNextPixels, containerSize, initialNextSize))
    }

    const handleEnd = () => {
      if (!this.isResizing.value) {
        return
      }

      this.isResizing.value = false

      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)

      // 触发结束事件
      if (this.onResizeEnd) {
        this.onResizeEnd()
      }
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)
  }

  /** 获取事件位置 */
  private getEventPosition(event: MouseEvent | TouchEvent, isHorizontal: boolean) {
    const isTouch = 'touches' in event
    const clientEvent = isTouch ? event.touches[0] : event
    return isHorizontal ? clientEvent.clientX : clientEvent.clientY
  }
}
