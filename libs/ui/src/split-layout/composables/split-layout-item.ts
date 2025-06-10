import type { SplitLayoutItemProps } from '../types'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { type SplitLayoutItemContext as ISplitLayoutItemContext, SplitLayoutContext } from './split-layout'

interface SplitLayoutItemElement extends HTMLElement {
  _splitLayoutItemContext: SplitLayoutItemContext
}

/** Dom 元素的标记，必须与模板中绑定的 dataset 属性相对应 */
const DATASET_KEY = 'vmdSplitLayoutItem'

export class SplitLayoutItemContext implements ISplitLayoutItemContext {
  splitLayout: SplitLayoutContext
  props: Required<SplitLayoutItemProps>

  /** 子组件在组件列表中的索引 */
  index = -1

  /** 子组件主元素引用 */
  itemEl = ref<SplitLayoutItemElement>()

  /** 内部大小状态，用于拖拽时动态更新 */
  private internalSize = ref<string>('')
  private internalMinSize = ref<string>('')
  private internalMaxSize = ref<string>('')

  constructor(props: Required<SplitLayoutItemProps>) {
    this.props = props
    this.splitLayout = SplitLayoutContext.use()

    // 初始化内部状态
    this.internalSize.value = props.size
    this.internalMinSize.value = props.minSize || ''
    this.internalMaxSize.value = props.maxSize || ''

    onMounted(() => {
      this.mount()
    })

    onBeforeUnmount(() => {
      this.unmount()
    })

    // 监听 props 变化，同步到内部状态
    watch(
      () => [props.size, props.minSize, props.maxSize],
      ([size, minSize, maxSize]) => {
        this.internalSize.value = size
        this.internalMinSize.value = minSize || ''
        this.internalMaxSize.value = maxSize || ''
        this.splitLayout.notifyResize()
      },
      { deep: true },
    )
  }

  /** 获取当前大小 */
  get currentSize() {
    return this.internalSize.value
  }

  /** 获取当前最小大小 */
  get currentMinSize() {
    return this.internalMinSize.value
  }

  /** 获取当前最大大小 */
  get currentMaxSize() {
    return this.internalMaxSize.value
  }

  mount() {
    const el = this.itemEl.value
    if (!el) {
      return
    }

    el._splitLayoutItemContext = this
    const prevItem = this.findPrevItem()
    const targetContext = prevItem?._splitLayoutItemContext
    const index = targetContext ? targetContext.index + 1 : 0
    this.splitLayout.items.splice(index, 0, this)
    this.index = index

    for (let i = index + 1; i < this.splitLayout.items.length; i++) {
      this.splitLayout.items[i].index = i
    }

    // 通知父组件更新
    this.splitLayout.notifyResize()
  }

  unmount() {
    const el = this.itemEl.value
    if (!el) {
      return
    }

    this.splitLayout.items.splice(this.index, 1)

    for (let i = this.index; i < this.splitLayout.items.length; i++) {
      this.splitLayout.items[i].index = i
    }

    // 通知父组件更新
    this.splitLayout.notifyResize()
  }

  findPrevItem() {
    if (!this.itemEl.value) {
      return null
    }

    let cur = this.itemEl.value.previousSibling
    while (cur) {
      if ((cur as any)?.dataset?.[DATASET_KEY]) {
        return cur as SplitLayoutItemElement
      }
      cur = cur.previousSibling
    }
    return null
  }

  /** 更新大小 */
  updateSize(newSize: string) {
    this.internalSize.value = newSize
    this.splitLayout.notifyResize()
  }
}
