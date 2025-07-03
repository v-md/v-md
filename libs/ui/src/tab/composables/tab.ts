import type { NamespaceContext } from '@v-md/ui'
import type {
  ComputedRef,
  InjectionKey,
  ModelRef,
} from 'vue'
import type { MenuContext, MenuInstance } from '../../menu'
import type { TippyComponent } from '../../tippy'
import type { TabModel, TabProps } from '../types'
import type { TabItemContext } from './tab-item'
import {
  debounce,
  parseCssSize,
} from '@v-md/shared'
import { useElementSize } from '@vueuse/core'
import {
  computed,
  inject,
  provide,
  ref,
  shallowReactive,
  watch,
} from 'vue'
import { useNamespace } from '../../config-provider'

const TAB_PROVIDE_KEY = Symbol('tab') as InjectionKey<TabContext>

export class TabContext {
  static use() {
    const res = inject(TAB_PROVIDE_KEY)
    if (!res) {
      throw new Error('Can not find parent tab!')
    }
    return res
  }

  readonly props: Required<TabProps>
  modelValue: ModelRef<TabModel['modelValue']>
  readonly namespace: NamespaceContext

  itemClassName(...names: string[]) {
    return this.namespace.c('tab', 'item', ...names)
  }

  /** 是否水平 */
  isHorizontal = computed(() => this.props.direction === 'horizontal')

  /** 外部容器引用 */
  containerEl = ref<HTMLUListElement>()

  /** 容器尺寸 */
  size: ComputedRef<number>

  /** 折叠元素引用 */
  collapseEl = ref<TippyComponent>()

  /** 折叠元素尺寸 */
  collapseSize: ComputedRef<number>

  /** 菜单组件引用 */
  menuEl = ref<MenuInstance>()

  /** 菜单元素 DOM 元素 */
  menuElDom = computed(() => this.menuEl.value?.$el)

  /** 子菜单引用 */
  tippyEl = ref<TippyComponent>()

  /** 子菜单的出现位置 */
  tippyPlacement = computed(() => this.isHorizontal.value ? 'bottom-start' : 'right-start')

  /** 子菜单面板的 Teleport 目标 */
  panelTeleportTo = computed(() => this.props.panelTeleportTo)

  /** 间隔的实际宽度，单位 px */
  gapSize = computed(() => {
    const parsed = parseCssSize(this.props.gap || '')
    if (parsed?.unit === 'px') {
      return parsed.value
    }
    return 0
  })

  constructor(
    props: Required<TabProps>,
    modelValue: ModelRef<TabModel['modelValue']>,
  ) {
    this.props = props
    this.modelValue = modelValue
    this.namespace = useNamespace()

    const { width, height } = useElementSize(
      this.containerEl,
      { width: -1, height: -1 },
      { box: 'border-box' },
    )
    this.size = computed(() => this.isHorizontal.value ? width.value : height.value)
    watch(this.size, () => {
      this.updateItems()
    })

    const { width: collapseWidth, height: collapseHeight } = useElementSize(
      this.collapseEl as any,
      { width: -1, height: -1 },
      { box: 'border-box' },
    )
    this.collapseSize = computed(() => this.isHorizontal.value ? collapseWidth.value : collapseHeight.value)
    watch(this.collapseSize, () => {
      this.updateItems()
    })

    provide(TAB_PROVIDE_KEY, this)
  }

  /** 子组件列表 */
  items = shallowReactive<TabItemContext[]>([])

  /** 临界索引 */
  cutIndex = ref<number>(0)

  /** 是否存在折叠 */
  isCollapse = computed(() => !this.props.disableCollapse && this.cutIndex.value < this.items.length)

  private _updateCutIndex() {
    if (!this.collapseEl.value || !this.containerEl.value) {
      return
    }

    console.log(this.items, this.items.length)
    let widthCount = this.collapseSize.value
    let isUpdated = false
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      console.log(i, widthCount, item, item.size.value, this.size.value)
      if (!item.itemEl.value) {
        continue
      }

      widthCount += item.size.value
      if (widthCount > this.size.value) {
        this.cutIndex.value = i
        isUpdated = true
        break
      }
    }

    if (!isUpdated) {
      this.cutIndex.value = this.items.length
    }
  }

  private _updateItems() {
    if (this.props.disableCollapse) {
      return
    }

    this._updateCutIndex()

    this.items.slice(0, this.cutIndex.value).forEach((item) => {
      item.collapse.value = false
    })

    this.items.slice(this.cutIndex.value).forEach((item) => {
      item.collapse.value = true
    })
  }

  updateItems = debounce(() => {
    this._updateItems()
  }, 0)
}
