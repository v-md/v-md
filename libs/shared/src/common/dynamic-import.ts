import type { DynamicImportResolver } from './types'
import { isFunction } from './type-check'

export async function resolveDynamicImport<T = string>(importResolver: DynamicImportResolver<T>): Promise<T> {
  return isFunction(importResolver) ? importResolver() : importResolver
}
