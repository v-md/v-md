import type { ComputedRef, EmitFn, InjectionKey } from 'vue'
import type { NamespaceContext } from '../../config-provider'
import type { SplitLayoutEmits, SplitLayoutProps } from '../types'
import type { SplitLayoutItemContext } from './split-layout-item'
import type { SplitLayoutResizerContext } from './split-layout-resizer'
import {
  camelCase,
  cssSizeToPixels,
  debounce,
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

  /** 是否水平 */
  isHorizontal = computed(() => this.props.direction === 'horizontal')

  /** 容器 DOM 元素 */
  containerEl = ref<HTMLElement>()

  /** 容器 DOM 元素尺寸，< 0 时表示未初始化 */
  containerSize: ComputedRef<number>

  /** 面板列表 */
  items = shallowReactive<SplitLayoutItemContext[]>([])

  /** 分割线列表 */
  resizers = shallowReactive<SplitLayoutResizerContext[]>([])

  constructor(props: Required<SplitLayoutProps>, emit: EmitFn<SplitLayoutEmits>) {
    this.props = props
    this.emit = emit
    this.namespace = useNamespace()

    const { width, height } = useElementSize(
      this.containerEl,
      { width: -1, height: -1 },
      { box: 'border-box' },
    )
    this.containerSize = computed(() => this.isHorizontal.value ? width.value : height.value)

    // 容器尺寸变化时，自动调整空间分配
    watch(this.containerSize, (val, oldVal) => {
      if (oldVal < 0) {
        this.autoAllowcateSpace()
        return
      }

      this._autoResizeSpace(val - oldVal)
    })

    provide(SPLIT_LAYOUT_PROVIDE_KEY, this)
  }

  /** 获取当前所有面板的大小，单位 px */
  getSizes(): number[] {
    return this.items.map(item => item.size.value)
  }

  /** 通知大小变化 */
  notifyResize = debounce(() => {
    this.emit('resize', this.getSizes())
  }, 0)

  /** 容器内元素增减时自动分配空间 */
  autoAllowcateSpace = debounce(() => {
    this._autoAllowcateSpace()
  }, 0)

  private _autoAllowcateSpace() {
    if (this.items.length === 0 || this.containerSize.value < 0) {
      return
    }

    /** 容器总像素 */
    const containerPixels = this.containerSize.value
    /** 分割线占用的像素 */
    const resizerTotalSize = this._calculateResizerPixels()
    /** 非 item 与 resizer 占用的像素 */
    const othersPixels = this._calculateOthersPixels()
    /** 已占有尺寸 */
    let fixedPixels = 0
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]

      if (item.hasInit.value) {
        fixedPixels += item.size.value
      }
      else if (item.initSizeParsed.value) {
        const { value, unit } = item.initSizeParsed.value
        const pixels = cssSizeToPixels(`${value}${unit}`, containerPixels)
        item.updateSize(pixels)
        fixedPixels += item.size.value
      }
      else {
        const pixels = item.getElementSize()
        item.updateSize(pixels)
        fixedPixels += item.size.value
      }
    }

    /** 需要自动像素的容器集合 */
    const autoFillItems = this.items.filter(item => item.props.autoFill)
    /** 自动分配剩余像素，若剩余空间不足，则视为 0 */
    let leftPixels = Math.max(0, containerPixels - resizerTotalSize - othersPixels - fixedPixels)
    while (leftPixels > 0 && autoFillItems.length > 0) {
      /** 平均分配像素 */
      const averagePixels = leftPixels / autoFillItems.length
      for (let i = 0; i < autoFillItems.length; i++) {
        // 自动平分剩余空间
        const item = autoFillItems[i]
        const deltaPixels = item.updateSize(item.size.value + averagePixels)
        leftPixels -= deltaPixels
        if (deltaPixels < averagePixels) {
          // 若分配的像素小于平均像素，说明触发了边界限制，该容器不再参与下一轮分配
          autoFillItems.splice(i, 1)
          i--
        }
      }
    }
  }

  /** 计算分割线占用的像素 */
  private _calculateResizerPixels(): number {
    return this.resizers.reduce((total, resizer) => total + resizer.size.value, 0)
  }

  /** 计算非 item 与 resizer 占用的像素 */
  private _calculateOthersPixels(): number {
    if (!this.containerEl.value) {
      return 0
    }

    const children = this.containerEl.value.children

    if (children.length === this.resizers.length + this.items.length) {
      return 0
    }

    let total = 0
    for (let i = 0; i < children.length; i++) {
      const child = children[i]

      // item 和 resizer 元素被排除
      if (
        child instanceof HTMLElement &&
        (
          child.dataset[camelCase(this.itemClassName())] !== undefined ||
          child.dataset[camelCase(this.resizerClassName())] !== undefined
        )
      ) {
        continue
      }

      const rect = child.getBoundingClientRect()
      total += (this.isHorizontal.value ? rect.width : rect.height)
    }

    return total
  }

  /** 当容器尺寸变化时，自动调整空间分配 */
  private _autoResizeSpace(delta: number) {
    const autoAdjustItems = this.items.filter(item => item.props.autoAdjust)
    let leftPixels = delta
    while (leftPixels !== 0 && autoAdjustItems.length > 0) {
      /** 平均分配像素 */
      const averagePixels = leftPixels / autoAdjustItems.length
      for (let i = 0; i < autoAdjustItems.length; i++) {
        // 自动平分剩余空间
        const item = autoAdjustItems[i]
        const deltaPixels = item.updateSize(item.size.value + averagePixels)
        leftPixels -= deltaPixels
        if (Math.abs(deltaPixels) < Math.abs(averagePixels)) {
          // 若分配的像素小于平均像素，说明触发了边界限制，该容器不再参与下一轮分配
          autoAdjustItems.splice(i, 1)
          i--
        }
      }
    }
  }
}
