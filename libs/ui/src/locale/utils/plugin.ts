import type { Plugin } from 'vue'
import type { LocaleOptions } from '../types/locale'
import { provideLocale } from '../composables/locale'
import { Locale } from '../model/locale'

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: Locale['t']
  }
}

export const localePlugin: Plugin<LocaleOptions[]> = {
  install(app, ...options) {
    const finalOptions: LocaleOptions = {}
    options.forEach((option) => {
      Object.assign(finalOptions, option)
    })

    const locale = new Locale(finalOptions)
    const { t } = provideLocale(app.provide.bind(app), locale)
    app.config.globalProperties.$t = t
  },
}
