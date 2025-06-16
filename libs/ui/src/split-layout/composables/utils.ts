/**
 * 分割布局组件的通用工具模块
 */

/**
 * 尺寸单位类型
 */
export type SizeUnit = 'px' | '%'

/**
 * 解析尺寸值的结果
 */
export interface ParsedSize {
  value: number
  unit: SizeUnit
}

/**
 * 尺寸工具类 - 处理尺寸值的解析、转换和计算
 */
export class SizeUtils {
  /**
   * 解析尺寸字符串为数值和单位
   */
  static parse(size: string): ParsedSize | null {
    if (!size) {
      return null
    }

    const match = size.match(/^(\d+(?:\.\d+)?)(px|%)?$/)
    if (!match) {
      return null
    }

    return {
      value: Number.parseFloat(match[1]),
      unit: (match[2] as SizeUnit) || 'px',
    }
  }

  /**
   * 将尺寸值转换为像素
   */
  static toPixels(size: string, containerSize: number): number {
    const parsed = this.parse(size)
    if (!parsed) {
      return 0
    }

    return parsed.unit === '%' ?
        (parsed.value / 100) * containerSize :
      parsed.value
  }

  /**
   * 将像素值转换为指定单位的字符串
   */
  static fromPixels(pixels: number, containerSize: number, originalSize: string): string {
    const parsed = this.parse(originalSize)
    if (!parsed) {
      return `${pixels}px`
    }

    return parsed.unit === '%' ?
      `${(pixels / containerSize) * 100}%` :
      `${pixels}px`
  }
}

/**
 * 标准化面板项尺寸值
 */
export class PanelSizeNormalizer {
  /**
   * 将 string | number | null 类型的大小值标准化为字符串
   */
  static normalize(size: string | number | null | undefined): string {
    if (size === null || size === undefined) {
      return ''
    }

    if (typeof size === 'number') {
      return `${size}px`
    }

    if (typeof size === 'string') {
      const trimmed = size.trim()
      if (!trimmed) {
        return ''
      }

      // 检查是否为纯数字
      if (/^\d+(?:\.\d+)?$/.test(trimmed)) {
        return `${trimmed}px`
      }

      // 检查是否为有效的 CSS 单位（仅支持 px、%）
      if (/^\d+(?:\.\d+)?(?:px|%)$/.test(trimmed)) {
        return trimmed
      }

      // 对于不符合规范的字符串，抛出警告并返回空字符串
      console.warn(`[SplitLayout] Invalid size value: ${size}. Supported formats: number (as px), 'Npx', 'N%', or null`)
      return ''
    }

    return ''
  }
}

/**
 * 标准化分割线尺寸值
 */
export class ResizerSizeNormalizer {
  static normalize(size: string | number): string {
    if (typeof size === 'number') {
      return `${size}px`
    }

    const trimmed = size.trim()

    // 检查是否为纯数字
    if (/^\d+(?:\.\d+)?$/.test(trimmed)) {
      return `${trimmed}px`
    }

    // 检查是否为有效的 px 单位
    if (/^\d+(?:\.\d+)?px$/.test(trimmed)) {
      return trimmed
    }

    // 对于不符合规范的字符串，抛出警告并返回默认值
    console.warn(`[SplitLayoutResizer] Invalid size value: ${size}. Supported formats: number (as px), 'Npx'`)
    return '4px'
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

/**
 * 事件处理工具类
 */
export class EventUtils {
  /**
   * 获取鼠标或触摸事件的位置
   */
  static getEventPosition(event: MouseEvent | TouchEvent, isHorizontal: boolean): number {
    const isTouch = 'touches' in event
    const clientEvent = isTouch ? event.touches[0] : event
    return isHorizontal ? clientEvent.clientX : clientEvent.clientY
  }

  /**
   * 创建事件监听器清理函数
   */
  static createEventCleanup(events: Array<{
    target: EventTarget
    type: string
    handler: EventListenerOrEventListenerObject
  }>): () => void {
    return () => {
      events.forEach(({ target, type, handler }) => {
        target.removeEventListener(type, handler)
      })
    }
  }
}
