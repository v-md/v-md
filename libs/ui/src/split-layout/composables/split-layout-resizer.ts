import type { EmitFn } from 'vue'
import type { SplitLayoutResizerEmits, SplitLayoutResizerProps } from '../types'
import type { SplitLayoutItemElement } from './split-layout-item'
import {
  camelCase,
  parseCssSize,
} from '@v-md/shared'
import { findSiblingWithDataset } from '@v-md/shared/browser'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'
import { SplitLayoutContext } from './split-layout'

interface SplitLayoutResizerElement extends HTMLElement {
  _splitLayoutResizerContext: SplitLayoutResizerContext
}

export class SplitLayoutResizerContext {
  readonly layout: SplitLayoutContext
  readonly props: Required<SplitLayoutResizerProps>
  readonly emit: EmitFn<SplitLayoutResizerEmits>

  /** 分割线元素 */
  resizerEl = ref<SplitLayoutResizerElement>()

  /** 是否正在拖拽 */
  isResizing = ref(false)

  /** 分割线实际宽度，单位 px */
  size = computed(() => {
    const parsed = parseCssSize(this.props.size || '')
    if (!parsed) {
      return 0
    }
    else if (parsed.unit === 'px') {
      return parsed.value
    }
    return 0
  })

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

    this._insertIntoResizerList(el)
  }

  unmount() {
    this._removeFromResizerList()
    this._clearResizeState()
  }

  /** 插入到分割线列表中 */
  private _insertIntoResizerList(el: SplitLayoutResizerElement) {
    el._splitLayoutResizerContext = this
    const prevResizer = findSiblingWithDataset<SplitLayoutResizerElement>(el, 'previousSibling', this.datasetKey)
    const targetContext = prevResizer?._splitLayoutResizerContext
    const index = targetContext ? targetContext.index + 1 : 0

    this.layout.resizers.splice(index, 0, this)
    this.index = index

    // 更新后续元素的索引
    this._updateSubsequentIndices(index)
  }

  /** 从分割线列表中移除 */
  private _removeFromResizerList() {
    this.layout.resizers.splice(this.index, 1)
    this._updateSubsequentIndices(this.index)
  }

  /** 更新后续元素的索引 */
  private _updateSubsequentIndices(startIndex: number) {
    for (let i = startIndex; i < this.layout.resizers.length; i++) {
      this.layout.resizers[i].index = i
    }
  }

  /** 事件监听器清理函数 */
  private _resizeEventCleanup: (() => void) | null = null

  /** 拖拽位置记录 */
  private _startPosition: number | null = null

  /** 开始拖拽时的初始面板大小 */
  private _initialSizes: number[] | null = null

  /** 前序面板索引 */
  private _prevItemIndex: number | null = null

  /** 后序面板索引 */
  private _nextItemIndex: number | null = null

  /**
   * 初始化拖拽状态
   * @param startPos 拖拽开始位置
   * @returns 是否成功初始化拖拽状态
   */
  private _initResizeState(startPos: number) {
    if (this.props.disabled) {
      return false
    }

    if (this.layout.containerSize.value < 0) {
      return false
    }

    if (this.isResizing.value) {
      return false
    }

    if (!this.resizerEl.value) {
      return false
    }

    this._clearResizeState()

    const prevEl = findSiblingWithDataset<SplitLayoutItemElement>(
      this.resizerEl.value,
      'previousSibling',
      camelCase(this.layout.itemClassName()),
    )
    this._prevItemIndex = prevEl?._splitLayoutItemContext?.index ?? null

    const nextEl = findSiblingWithDataset<SplitLayoutItemElement>(
      this.resizerEl.value,
      'nextSibling',
      camelCase(this.layout.itemClassName()),
    )
    this._nextItemIndex = nextEl?._splitLayoutItemContext?.index ?? null

    if (typeof this._prevItemIndex !== 'number' || typeof this._nextItemIndex !== 'number') {
      return false
    }

    this._startPosition = startPos
    this._initialSizes = this.layout.getSizes()
    this.isResizing.value = true
    return true
  }

  private _clearResizeState() {
    this._resizeEventCleanup?.()
    this._startPosition = null
    this._initialSizes = null
    this._prevItemIndex = null
    this._nextItemIndex = null
    this.isResizing.value = false
  }

  /** 开始拖拽 */
  startResize(event: MouseEvent | TouchEvent) {
    event.preventDefault()
    if (!this._initResizeState(this._getEventPosition(event))) {
      return
    }

    this.emit('resize-start')

    // 创建事件处理器
    const handleMove = this._createMoveHandler()
    const handleEnd = this._createEndHandler()

    // 注册事件监听器并保存清理函数
    this._resizeEventCleanup = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
      this._resizeEventCleanup = null
    }

    // 立即添加事件监听器
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)
  }

  private _getEventPosition(event: MouseEvent | TouchEvent): number {
    const isTouch = 'touches' in event
    const clientEvent = isTouch ? event.touches[0] : event
    return this.layout.isHorizontal.value ? clientEvent.clientX : clientEvent.clientY
  }

  /** 创建移动事件处理器 */
  private _createMoveHandler() {
    return (moveEvent: MouseEvent | TouchEvent) => {
      if (!this.isResizing.value || typeof this._startPosition !== 'number') {
        return
      }

      const currentPosition = this._getEventPosition(moveEvent)
      const delta = currentPosition - this._startPosition
      this._move(delta)
    }
  }

  /** 创建结束事件处理器 */
  private _createEndHandler() {
    return () => {
      if (!this.isResizing.value) {
        return
      }

      this.isResizing.value = false
      this._clearResizeState()
      this.emit('resize-end')
    }
  }

  /**
   * 移动分割线
   * @param offset 偏移量，单位 px，向右/下为正，向左/上为负。会受到面板约束条件的影响
   */
  move(offset: number) {
    if (!this.resizerEl.value) {
      return
    }

    if (!this._initResizeState(0)) {
      return
    }

    this._move(offset)

    this._clearResizeState()
  }

  _move(offset: number) {
    if (typeof this._prevItemIndex !== 'number' || typeof this._nextItemIndex !== 'number') {
      return
    }

    /** 偏移量符号恢复 */
    const recoverOp = (absNum: number) => offset < 0 ? -absNum : absNum

    const sizes = [...(this._initialSizes || [])]
    let prevIndex = this._prevItemIndex
    let nextIndex = this._nextItemIndex
    const _prevItem = () => this.layout.items[prevIndex]
    const _nextItem = () => this.layout.items[nextIndex]
    const _prevSize = () => sizes?.[prevIndex] || -1
    const _nextSize = () => sizes?.[nextIndex] || -1

    // 计算期望的新尺寸
    let curOffset = offset
    while (Math.abs(curOffset) > 0 && _prevItem() && _nextItem()) {
      const prevItem = _prevItem()
      const nextItem = _nextItem()
      const prevSize = _prevSize()
      const nextSize = _nextSize()

      const prevSizeChange = prevItem.getSizeChange(prevSize + curOffset, prevSize)
      const nextSizeChange = nextItem.getSizeChange(nextSize - curOffset, nextSize)
      const actualSizeChange = recoverOp(Math.min(Math.abs(prevSizeChange), Math.abs(nextSizeChange)))

      // console.log('change', prevSizeChange, nextSizeChange, actualSizeChange)
      const isLimit = Math.abs(actualSizeChange) < Math.abs(curOffset)
      const isPrevSizeLimit = Math.abs(actualSizeChange) === Math.abs(prevSizeChange) && isLimit
      const isNextSizeLimit = Math.abs(actualSizeChange) === Math.abs(nextSizeChange) && isLimit

      sizes[prevIndex] = prevSize + actualSizeChange
      sizes[nextIndex] = nextSize - actualSizeChange
      curOffset -= actualSizeChange

      if (Math.abs(curOffset) > 0) {
        if (isPrevSizeLimit) {
          prevIndex--
        }

        if (isNextSizeLimit) {
          nextIndex++
        }
      }
    }

    this.layout.items.forEach((item, index) => {
      item.updateSize(sizes[index])
    })
  }
}
