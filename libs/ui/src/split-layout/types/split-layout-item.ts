import type { InferVueDefaults } from '../../common'

export interface SplitLayoutItemProps {
  /**
   * 面板大小
   * 支持 CSS 单位：如 '200px', '50%', '1fr' 等
   * @default '1fr'
   */
  size?: string

  /**
   * 面板最小大小
   * 支持 CSS 单位：如 '100px', '20%' 等
   */
  minSize?: string

  /**
   * 面板最大大小
   * 支持 CSS 单位：如 '500px', '80%' 等
   */
  maxSize?: string
}

export function defaultSplitLayoutItemProps() {
  return {
    size: '1fr',
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
