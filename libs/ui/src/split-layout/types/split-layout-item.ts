import type { InferVueDefaults } from '../../common'

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
   * - null: 自动分配，与其他 size 为 null 的面板平分剩余空间<br/>自动分配会考虑容器尺寸、固定面板大小和分割线占用的空间
   *
   * @default null
   */
  size?: string | number | null

  /**
   * 面板最小大小
   *
   * **注意：此属性仅在组件初始化时生效，后续修改不会触发重新计算（非响应性）**
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
   * **注意：此属性仅在组件初始化时生效，后续修改不会触发重新计算（非响应性）**
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
}

export function defaultSplitLayoutItemProps() {
  return {
    size: null,
    minSize: null,
    maxSize: null,
  } satisfies InferVueDefaults<SplitLayoutItemProps>
}

export interface SplitLayoutItemEmits {}

export interface SplitLayoutItemSlots {
  /**
   * 默认插槽，面板内容
   */
  default: void
}

export interface SplitLayoutItemExpose {
  /**
   * 更新面板大小
   */
  updateSize: (size: string) => void
}
