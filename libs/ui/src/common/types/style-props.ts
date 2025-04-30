import type { CSSProperties } from 'vue'

export interface StyleProps {
  /** 元素的 class */
  className?: string

  /** 元素的内联样式 */
  styles?: CSSProperties
}
