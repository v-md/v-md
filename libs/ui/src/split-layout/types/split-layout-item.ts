import type { InferVueDefaults } from '../../common'
import type SplitLayoutItem from '../views/split-layout-item.vue'

export interface SplitLayoutItemProps {
  /**
   * 面板初始大小
   *
   * **注意：此属性仅在组件初始化时生效，后续修改不会触发重新计算（非响应性）**
   *
   * 支持以下类型：
   * - string: 支持 CSS 单位，如 '200px'、'50%'
   *   - px: 像素单位，如 '200px'
   *   - %: 百分比单位，如 '50%'
   * - number: 数字类型，默认单位为 px，如 200 等价于 '200px'
   * - null: 自动分配
   *
   * @default null
   */
  size?: string | number | null

  /**
   * 面板最小大小
   *
   * 支持以下类型：
   * - string: 支持 CSS 单位，但仅限 px 和 % 单位
   *   - px: 像素单位，如 '100px'
   *   - %: 百分比单位，如 '20%'
   * - number: 数字类型，默认单位为 px，如 100 等价于 '100px'
   * - null: 不限制最小大小
   *
   * @default null
   */
  minSize?: string | number | null

  /**
   * 面板最大大小
   *
   * 支持以下类型：
   * - string: 支持 CSS 单位，但仅限 px 和 % 单位
   *   - px: 像素单位，如 '500px'
   *   - %: 百分比单位，如 '80%'
   * - number: 数字类型，默认单位为 px，如 500 等价于 '500px'
   * - null: 不限制最大大小
   *
   * @default null
   */
  maxSize?: string | number | null

  /**
   * 容器内元素增减时是否与其他同类型面板平分剩余空间 (会受到 `minSize` 和 `maxSize` 限制)：
   * @default false
   */
  autoFill?: boolean

  /**
   * 容器大小变动时是否自动调整大小 (会受到 `minSize` 和 `maxSize` 限制)
   * @default true
   */
  autoAdjust?: boolean
}

export function defaultSplitLayoutItemProps() {
  return {
    size: null,
    minSize: null,
    maxSize: null,
    autoFill: false,
    autoAdjust: true,
  } satisfies InferVueDefaults<SplitLayoutItemProps>
}

export interface SplitLayoutItemEmits {}

export interface SplitLayoutItemSlots {
  /**
   * 默认插槽，面板内容
   */
  default: () => any
}

export interface SplitLayoutItemExpose {
  /**
   * 更新面板大小 (会受到 `minSize` 和 `maxSize` 限制)
   * @param size 新的尺寸
   * @returns 实际的尺寸变动
   */
  updateSize: (size: number | string) => number
}

export type SplitLayoutItemInstance = InstanceType<typeof SplitLayoutItem>
