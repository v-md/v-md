import type { SplitLayoutItemProps } from '../types'
import {
  camelCase,
  clamp,
  cssSizeToPixels,
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

export interface SplitLayoutItemElement extends HTMLElement {
  _splitLayoutItemContext: SplitLayoutItemContext
}

export class SplitLayoutItemContext {
  readonly layout: SplitLayoutContext
  readonly props: Required<SplitLayoutItemProps>
  readonly itemEl = ref<SplitLayoutItemElement>()

  /** 子组件在组件列表中的索引 */
  index = -1

  /** dataset 属性 */
  get datasetKey() {
    return camelCase(this.layout.itemClassName())
  }

  /** 模板绑定的 dataset 属性 */
  get datasetTemplateKey() {
    return `data-${this.layout.itemClassName()}`
  }

  constructor(props: Required<SplitLayoutItemProps>) {
    this.props = props
    this.layout = SplitLayoutContext.use()

    onMounted(() => {
      this.mount()
    })

    onBeforeUnmount(() => {
      this.unmount()
    })
  }

  /** 初始化时标准化后的 size 属性 */
  initSizeParsed = computed(() => parseCssSize(this.props.size || ''))

  /** 容器的尺寸是否已经初始化 */
  hasInit = computed(() => this.size.value >= 0)

  /** 容器当前大小尺寸，单位 px。-1 表示未初始化 */
  size = ref(-1)

  /** 容器最大尺寸，单位 px。-1 表示未初始化 */
  maxSize = computed(() => {
    const parsed = parseCssSize(this.props.maxSize || '')
    if (!parsed) {
      return -1
    }

    if (parsed.unit === 'px') {
      return parsed.value
    }

    return parsed.unit === '%' ? cssSizeToPixels(`${parsed.value}%`, this.layout.containerSize.value) : -1
  })

  /** 容器最小尺寸，单位 px。-1 表示未初始化 */
  minSize = computed(() => {
    const parsed = parseCssSize(this.props.minSize || '')
    if (!parsed) {
      return -1
    }

    if (parsed.unit === 'px') {
      return parsed.value
    }

    return parsed.unit === '%' ? cssSizeToPixels(`${parsed.value}%`, this.layout.containerSize.value) : -1
  })

  /** 是否达到最大尺寸 */
  isSizeMax = computed(() => this.size.value >= 0 && this.size.value >= this.maxSize.value)

  /** 是否达到最小尺寸 */
  isSizeMin = computed(() => this.size.value >= 0 && this.size.value <= this.minSize.value)

  /** 尺寸是否达到限制 */
  isSizeLimit = computed(() => this.isSizeMax.value || this.isSizeMin.value)

  /**
   * 计算待更新尺寸与基准尺寸的差值，实际更新的尺寸会确保大小在 minSize 和 maxSize 之间
   * @param size 新的尺寸
   * @param baseSize 基准尺寸，默认为当前尺寸
   * @returns 差值，单位 px
   */
  getSizeChange(size: number | string, baseSize = this.size.value) {
    let newSize = 0
    if (typeof size === 'number') {
      newSize = size
    }
    else if (typeof size === 'string') {
      const parsed = parseCssSize(size)
      if (!parsed) {
        return 0
      }
      else if (parsed.unit === 'px') {
        newSize = parsed.value
      }
      else if (parsed.unit === '%') {
        newSize = cssSizeToPixels(`${parsed.value}%`, this.layout.containerSize.value)
      }
    }

    const min = this.minSize.value >= 0 ? this.minSize.value : 0
    const max = this.maxSize.value >= 0 ? this.maxSize.value : Infinity
    return clamp(newSize, min, max) - baseSize
  }

  /**
   * 更新大小，会确保大小在 minSize 和 maxSize 之间
   * @param size 新的尺寸
   * @returns 实际的尺寸变动
   */
  updateSize(size: number | string) {
    const sizeChange = this.getSizeChange(size)
    if (sizeChange === 0) {
      return 0
    }

    const oldSize = this.size.value
    this.size.value += sizeChange
    this.layout.notifyResize()
    return this.size.value - oldSize
  }

  /** 获取 DOM 元素的尺寸 */
  getElementSize() {
    const el = this.itemEl.value
    if (!el) {
      return 0
    }

    const rect = el.getBoundingClientRect()
    return this.layout.isHorizontal.value ? rect.width : rect.height
  }

  mount() {
    const el = this.itemEl.value
    if (!el) {
      return
    }

    this._insertIntoItemList(el)
    this.layout.autoAllowcateSpace()
  }

  unmount() {
    this._removeFromItemList()
    this.layout.autoAllowcateSpace()
  }

  /** 插入到面板列表中 */
  private _insertIntoItemList(el: SplitLayoutItemElement) {
    el._splitLayoutItemContext = this
    const prevItem = findSiblingWithDataset<SplitLayoutItemElement>(el, 'previousSibling', this.datasetKey)
    const targetContext = prevItem?._splitLayoutItemContext
    const index = targetContext ? targetContext.index + 1 : 0

    this.layout.items.splice(index, 0, this)
    this.index = index

    // 更新后续元素的索引
    this._updateSubsequentIndices(index)
  }

  /** 从面板列表中移除 */
  private _removeFromItemList() {
    this.layout.items.splice(this.index, 1)
    this._updateSubsequentIndices(this.index)
  }

  /** 更新后续元素的索引 */
  private _updateSubsequentIndices(startIndex: number) {
    for (let i = startIndex; i < this.layout.items.length; i++) {
      this.layout.items[i].index = i
    }
  }
}
