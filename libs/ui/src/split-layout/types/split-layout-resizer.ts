import type { InferVueDefaults } from '../../common'

export interface SplitLayoutResizerProps {
  /**
   * 是否禁用调整
   * 禁用后两侧的容器无法通过拖拽此分割线调整宽度
   * @default false
   */
  disabled?: boolean

  /**
   * 分割线大小
   *
   * 支持以下类型：
   * - string: 支持 CSS 单位，但仅限 px 单位，如 '4px'
   * - number: 数字类型，默认单位为 px，如 4 等价于 '4px'
   *
   * @default '4px'
   */
  size?: string | number
}

export function defaultSplitLayoutResizerProps() {
  return {
    disabled: false,
    size: '4px',
  } satisfies InferVueDefaults<SplitLayoutResizerProps>
}

export interface SplitLayoutResizerEmits {
  /**
   * 拖拽开始事件
   */
  'resize-start': []

  /**
   * 拖拽结束事件
   */
  'resize-end': []
}

export interface SplitLayoutResizerSlots {}

export interface SplitLayoutResizerExpose {
  move: (offset: number) => void
}
