import type { DynamicImportResolver } from '@v-md/shared'
import type { ImgHTMLAttributes } from 'vue'

export interface IconProps {
  /**
   * 图标 url
   *
   * 为空代表不展示小图标
   *
   * 支持异步加载
   */
  url?: DynamicImportResolver<string>

  /**
   * 图标的类型：
   * - svg: svg 格式的图标，支持换色
   * - img: img 图片图标，不支持换色
   * @default 'svg'
   */
  type?: 'svg' | 'img'
}

export type IconPropsWithAttrs = IconProps & ImgHTMLAttributes
