/**
 * 分割布局组件的通用工具模块
 */

import {
  cssSizeToPixels,
  normalizeCssSize,
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

/**
 * 标准化面板项尺寸值
 * 基于 @v-md/shared 中的 normalizeCssSize 函数实现
 */
export class PanelSizeNormalizer {
  /**
   * 将 string | number | null 类型的大小值标准化为字符串
   */
  static normalize(size: string | number | null | undefined): string {
    const normalized = normalizeCssSize(size, ['px', '%'])

    // 保持与原实现一致的警告信息
    if (size != null && size !== undefined && size !== '' && !normalized) {
      console.warn(`[SplitLayout] Invalid size value: ${size}. Supported formats: number (as px), 'Npx', 'N%', or null`)
    }

    return normalized
  }
}

/**
 * 标准化分割线尺寸值
 */
export class ResizerSizeNormalizer {
  static normalize(size: string | number): string {
    const normalized = normalizeCssSize(size, ['px'])

    if (!normalized) {
      // 对于不符合规范的字符串，抛出警告并返回默认值
      console.warn(`[SplitLayoutResizer] Invalid size value: ${size}. Supported formats: number (as px), 'Npx'`)
      return '4px'
    }

    return normalized
  }
}

/**
 * DOM 操作工具类
 */
export class DOMUtils {
  /**
   * 查找具有指定 dataset 属性的兄弟元素
   */
  static findSiblingWithDataset(
    startEl: HTMLElement,
    direction: 'previousSibling' | 'nextSibling',
    datasetKey: string,
  ): HTMLElement | null {
    let cur = startEl[direction]
    while (cur) {
      if ((cur as any)?.dataset?.[datasetKey] !== undefined) {
        return cur as HTMLElement
      }
      cur = cur[direction]
    }
    return null
  }
}
