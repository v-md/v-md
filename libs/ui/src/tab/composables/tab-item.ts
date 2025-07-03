import type {
  ComputedRef,
} from 'vue'
import type { TabItemProps } from '../types'
import { camelCase } from '@v-md/shared'
import { findSiblingWithDataset } from '@v-md/shared/browser'
import { useElementSize } from '@vueuse/core'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { TabContext } from './tab'

export interface TabItemElement extends HTMLElement {
  _tabItemContext: TabItemContext
}

export class TabItemContext {
  readonly tab: TabContext
  readonly props: Required<TabItemProps>

  /** dataset 属性 */
  get datasetKey() {
    return camelCase(this.tab.itemClassName())
  }

  /** 模板绑定的 dataset 属性 */
  get datasetTemplateKey() {
    return `data-${this.tab.itemClassName()}`
  }

  /** 子组件在列表中的索引 */
  index = -1

  /** 子组件元素引用 */
  itemEl = ref<TabItemElement>()

  /** 容器尺寸，单位 px */
  size: ComputedRef<number>

  /** 是否折叠 */
  collapse = ref(false)

  /** 是否被选中 */
  isActive = computed(() => this.tab.modelValue.value === this.props.value)

  /** 是否在折叠菜单中 */
  inMenu = computed(() => this.tab.menuEl.value && this.collapse.value)

  /** panel 是否初始化 */
  isPanelInitialized = ref(false)

  constructor(props: Required<TabItemProps>) {
    this.props = props
    this.tab = TabContext.use()

    const { width, height } = useElementSize(
      this.itemEl,
      { width: -1, height: -1 },
      { box: 'border-box' },
    )
    this.size = computed(() => this.tab.isHorizontal.value ? width.value : height.value)

    watch(this.size, (val, oldVal) => {
      if (this.props.value === 'collapse5') {
        console.log(val, oldVal)
      }
    })

    watch([this.isActive, this.tab.panelTeleportTo], ([val, teleportTarget]) => {
      if (!val || !teleportTarget) {
        return
      }

      this.isPanelInitialized.value = true
    }, { immediate: true })

    onMounted(() => {
      this.mount()
    })

    onBeforeUnmount(() => {
      this.unmount()
    })
  }

  mount() {
    const el = this.itemEl.value
    if (!el) {
      return
    }

    this._insertIntoItemList(el)
    this.tab.updateItems()
  }

  unmount() {
    this._removeFromItemList()
    this.tab.updateItems()
  }

  /** 插入到面板列表中 */
  private _insertIntoItemList(el: TabItemElement) {
    el._tabItemContext = this
    const prevItem = findSiblingWithDataset<TabItemElement>(el, 'previousSibling', this.datasetKey)
    const targetContext = prevItem?._tabItemContext
    const index = targetContext ? targetContext.index + 1 : 0

    this.tab.items.splice(index, 0, this)
    this.index = index

    // 更新后续元素的索引
    this._updateSubsequentIndices(index)
  }

  /** 从面板列表中移除 */
  private _removeFromItemList() {
    this.tab.items.splice(this.index, 1)
    this._updateSubsequentIndices(this.index)
  }

  /** 更新后续元素的索引 */
  private _updateSubsequentIndices(startIndex: number) {
    for (let i = startIndex; i < this.tab.items.length; i++) {
      this.tab.items[i].index = i
    }
  }

  /** 点击触发 */
  handleClick() {
    if (this.props.disableSelect) {
      return
    }

    this.tab.modelValue.value = this.props.value
  }
}
