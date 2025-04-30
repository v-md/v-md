import type { DynamicImportResolver } from '@v-md/shared'
import type { WatchSource } from 'vue'
import { resolveDynamicImport } from '@v-md/shared'
import { ref, watch } from 'vue'

export function useDynamicImport<T = string>(
  importSource: WatchSource<DynamicImportResolver<T> | undefined | null>,
) {
  const result = ref<T | null | undefined>(null)
  watch(importSource, (value) => {
    resolveDynamicImport(value).then((res) => {
      result.value = res
    })
  }, { immediate: true })
  return { result }
}
