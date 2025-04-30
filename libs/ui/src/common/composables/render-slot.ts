import type { Promisable } from '@v-md/shared'
import type { VNode, WatchSource } from 'vue'
import { toPromise } from '@v-md/shared'
import { ref, watch } from 'vue'

export type RenderSlotFn = (...args: any[]) => Promisable<VNode>

export function useRenderSlot<T extends RenderSlotFn = RenderSlotFn>(
  renderFn: WatchSource<T | undefined | null>,
  ...args: Parameters<T>
) {
  const renderComponent = ref<VNode | null | undefined>(null)
  watch(renderFn, (fn) => {
    if (!fn) {
      return
    }

    toPromise(fn, args as any).then((res) => {
      renderComponent.value = res
    })
  }, { immediate: true })
  return { renderComponent }
}
