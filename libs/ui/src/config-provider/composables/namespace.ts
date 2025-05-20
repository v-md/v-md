import type {
  InjectionKey,
} from 'vue'
import type { ConfigProviderProps } from '../types/config-provider'
import {
  cssClassName,
  cssVarName,
} from '@v-md/shared'
import {
  computed,
  inject,
  provide,
} from 'vue'

export interface NamespaceContext {
  /** 获取 css Class 名称 */
  c: (...names: string[]) => string

  /** 获取 css 变量名称 */
  v: (...names: string[]) => string
}

const NAMESPACE_PROVIDE_KEY: InjectionKey<NamespaceContext> = Symbol('namespace')

const DEFAULT_NAMESPACE = 'vmd'

/**
 * 在 Vue 环境初始化命名空间实例
 * @params props
 */
export function useNamespaceProvide(
  props: ConfigProviderProps,
) {
  const namespace = computed(() => props.namespace || DEFAULT_NAMESPACE)

  const context: NamespaceContext = {
    c: (...names) => cssClassName(namespace.value, ...names),
    v: (...names) => cssVarName(namespace.value, ...names),
  }

  provide(NAMESPACE_PROVIDE_KEY, context)
  return context
}

/**
 * 在 Vue 环境获取命名空间实例
 *
 * 如果未通过 provide 注册命名空间实例，则会使用默认的命名空间实例
 */
export function useNamespace() {
  const res = inject<NamespaceContext>(NAMESPACE_PROVIDE_KEY, {
    c: (...names) => cssClassName(DEFAULT_NAMESPACE, ...names),
    v: (...names) => cssVarName(DEFAULT_NAMESPACE, ...names),
  })
  return res
}
