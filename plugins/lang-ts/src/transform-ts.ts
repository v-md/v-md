import type { Transform } from 'sucrase'
import { transform } from 'sucrase'

export function transformTs(src: string, isJsx?: boolean) {
  return transform(src, {
    transforms: ['typescript', ...(isJsx ? (['jsx'] as Transform[]) : [])],
    jsxRuntime: 'preserve',
  }).code
}
