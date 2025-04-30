import type {
  InjectionKey,
  provide,
} from 'vue'
import type { Locale } from '../model/locale'
import { inject } from 'vue'
import { useVueApp } from '../../common'
import { defaultLocale } from '../utils/default'

export type LocaleContext = ReturnType<Locale['toVueContext']>

const LOCALE_PROVIDE_KEY: InjectionKey<LocaleContext> = Symbol('locale')

/**
 * 在 Vue 环境初始化本地化实例
 * @param provideFn Vue 的 `provide` 函数
 * @param locale 本地化实例对象
 */
export function provideLocale(provideFn: typeof provide, locale: Locale) {
  const context = locale.toVueContext()
  provideFn(LOCALE_PROVIDE_KEY, context)
  return context
}

/**
 * 在 Vue 环境获取本地化实例
 *
 * 如果未通过 provide 注册自定义的本地化实例，则会使用默认的本地化实例
 */
export function useLocale() {
  let res = inject(LOCALE_PROVIDE_KEY)
  if (!res) {
    const app = useVueApp()
    res = provideLocale(app.provide.bind(app), defaultLocale())
  }
  return res
}
