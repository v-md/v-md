/**
 * 分割布局组件的通用工具模块
 */

/** 尺寸单位类型 */
export type CssSizeUnit = 'px' | '%'

/** 解析尺寸值的结果 */
export interface CssParsedSize {
  /** 尺寸数值 */
  value: number

  /** 尺寸单位，支持 px、% */
  unit: CssSizeUnit
}

/**
 * 解析 CSS 尺寸值
 * @param size CSS 尺寸值，支持 number、'Npx'、'N%' 格式
 * @returns 解析后的尺寸值
 */
export function parseCssSize(size: string | number): CssParsedSize | null {
  if (typeof size === 'number') {
    return {
      value: size,
      unit: 'px',
    }
  }

  const match = size.match(/^(\d+(?:\.\d+)?)(px|%)?$/)
  if (!match) {
    // 对于不符合规范的字符串，返回 null
    return null
  }

  return {
    value: Number.parseFloat(match[1]),
    unit: (match[2] as CssSizeUnit) || 'px',
  }
}

/**
 * 将 CSS 尺寸值转换为像素值
 * @param size CSS 尺寸值，支持 number、'Npx'、'N%' 格式
 * @param containerSize 容器尺寸，当尺寸值的单位为 % 时，需要传入容器尺寸
 * @returns 转换后的像素值
 */
export function cssSizeToPixels(size: string | number, containerSize?: number) {
  const parsed = parseCssSize(size)
  if (!parsed) {
    return 0
  }

  if (parsed.unit === '%' && typeof containerSize === 'number') {
    return (parsed.value / 100) * containerSize
  }

  return parsed.value
}

/**
 * 将像素值转换为 CSS 尺寸值
 * @param pixels 像素值
 * @param unit 转换后的单位
 * @param containerSize 如果要转换为 % 单位，则需要传入容器尺寸
 * @returns 转换后的 CSS 尺寸值
 */
export function pixelsToCssSize(pixels: number, unit: CssSizeUnit, containerSize?: number) {
  if (unit === '%' && !containerSize) {
    throw new Error('containerSize is required when converting to %')
  }
  else if (unit === '%' && containerSize) {
    return `${(pixels / containerSize) * 100}%`
  }

  return `${pixels}px`
}

/**
 * 将 string | number | null | undefined 类型的 CSS 尺寸值标准化为字符串
 * @param size CSS 尺寸值，可能为非标准输入，各种输入处理方式如下：
 * - 如果 size 为 number，则返回 'Npx'
 * - 如果 size 为 null 或 undefined 或空字符串，则返回 ''
 * - 如果 size 为 'Npx'、'N%' 等支持的 CSS 尺寸，则原样返回。
 * - 如果 size 为其他类型的字符串，则抛出警告，返回 ''
 * @param availableUnits 支持的 CSS 尺寸单位，默认支持 px、%
 * @returns 标准化后的 CSS 尺寸值
 */
export function normalizeCssSize(
  size?: string | number | null,
  availableUnits: CssSizeUnit[] = ['px', '%'],
) {
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

    const parsed = parseCssSize(trimmed)
    if (!parsed || !availableUnits.includes(parsed.unit)) {
      // 对于不符合规范的字符串，抛出警告并返回空字符串
      console.warn(`Invalid size value: ${size}. Supported units: ${availableUnits.join(', ')}`)
      return ''
    }

    return trimmed
  }

  return ''
}
