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
   * @default '4px'
   */
  size?: string
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

export interface SplitLayoutResizerExpose {}
