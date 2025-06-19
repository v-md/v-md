import type { InferVueDefaults } from '../../common'

export type SplitDirection = 'horizontal' | 'vertical'

// 主组件类型定义
export interface SplitLayoutProps {
  /**
   * 分割方向
   * @default 'horizontal'
   */
  direction?: SplitDirection
}

export function defaultSplitLayoutProps() {
  return {
    direction: 'horizontal',
  } satisfies InferVueDefaults<SplitLayoutProps>
}

export interface SplitLayoutEmits {
  /**
   * 大小调整事件
   * @param sizes 新的大小比例数组
   */
  resize: [sizes: number[]]
}

export interface SplitLayoutSlots {
  /**
   * 默认插槽，放置 SplitLayoutItem 和 SplitLayoutResizer 组件
   */
  default: void
}

export interface SplitLayoutExpose {
  /**
   * 获取当前所有面板的大小
   */
  getSizes: () => number[]
}
