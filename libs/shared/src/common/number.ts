/**
 * 确保数值在指定范围内
 * @param value 要限制的数值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的数值
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
