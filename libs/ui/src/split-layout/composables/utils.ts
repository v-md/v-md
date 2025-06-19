/**
 * 分割布局组件的通用工具模块
 */

import {
  parseCssSize,
  pixelsToCssSize,
} from '@v-md/shared'

/**
 * 尺寸工具类 - 处理尺寸值的解析、转换和计算
 * 基于 @v-md/shared 中的 css-size 函数实现
 */
export class SizeUtils {
  /**
   * 将像素值转换为指定单位的字符串
   */
  static fromPixels(pixels: number, containerSize: number, originalSize: string): string {
    const parsed = parseCssSize(originalSize)
    const unit = parsed?.unit || 'px'
    return pixelsToCssSize(pixels, unit, containerSize)
  }
}
