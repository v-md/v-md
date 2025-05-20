import type {
  ComputedRef,
} from 'vue'
import type { ConfigProviderProps, DefaultProps } from '../types/config-provider'
import { mergeDeep } from '@v-md/shared'
import {
  computed,
  inject,
  provide,
  reactive,
  watch,
} from 'vue'

export function useDefaultPropsProvide(props: ConfigProviderProps) {
  Object.keys(props).forEach((key) => {
    // 默认属性参数必须以 Default 结尾
    if (!key.endsWith('Default')) {
      return
    }

    const k = key as keyof DefaultProps
    const provideKey = toProvideKey(k)
    const provideProps = computed(() => {
      return props[k] ? props[k] : {}
    })
    provide(provideKey, provideProps)
  })
}

export function useDefaultProps<K extends keyof DefaultProps>(
  key: K,
  initialProps: Required<DefaultProps>[K],
  defaults: () => Required<DefaultProps>[K],
) {
  const injectProps = inject<ComputedRef<Required<DefaultProps>[K]>>(
    toProvideKey(key),
    computed(() => ({})),
  )
  const defaultProps = defaults()
  const props = reactive(
    mergeDeep(
      { ignoreUndef: true, createNew: true },
      defaultProps,
      injectProps.value,
      initialProps,
    ),
  ) as Required<DefaultProps>[K]

  watch([injectProps, initialProps], ([injectVal, initialVal]) => {
    mergeDeep(
      { ignoreUndef: true, createNew: false },
      props,
      injectVal,
      initialVal as Required<DefaultProps>[K],
    )
  })

  return props
}

function toProvideKey<K extends keyof DefaultProps>(key: K) {
  return `__vmd_${key}__`
}
