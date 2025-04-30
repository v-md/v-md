import type { App } from 'vue'
import { getCurrentInstance } from 'vue'

export interface UseVueAppFn {
  (): App

  /** 错误信息 */
  errMsg: string
}

export const useVueApp: UseVueAppFn = () => {
  const app = getCurrentInstance()
  if (!app) {
    throw new Error(useVueApp.errMsg)
  }
  return app.appContext.app
}

useVueApp.errMsg = '"useVueApp" must be called within a Vue component!'
