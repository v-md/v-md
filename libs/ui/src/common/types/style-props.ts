import type { CSSProperties } from 'vue'

export interface StyleProps {
  /**
   * 元素的 class
   * @default ''
   */
  className?: string

  /**
   * 元素的内联样式
   * @default {}
   */
  styles?: CSSProperties
}
