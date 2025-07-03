import type { HTMLAttributes } from 'vue'
import {
  LayoutActivityModel,
  LayoutBottomModel,
  LayoutTopModel,
} from '../modules/layout'
import { Locale } from '../modules/locale'
import { definePlugin } from '../modules/plugin'

export interface PluginBasicOptions {
  /**
   * 命名空间
   * @default 'vmd'
   */
  namespace?: string

  /**
   * 编辑器根元素的 HTML 属性
   * @default {}
   */
  attrs?: HTMLAttributes

  /**
   * 默认活动项
   * @default 'explorer'
   */
  defaultActivity?: string
}

export function pluginBasic(options?: PluginBasicOptions) {
  const plugin = definePlugin<PluginBasicOptions>({
    name: 'basic',
    options,
    onRegistered(editor) {
      editor.namespace.value = plugin.options.namespace || 'vmd'
      editor.attrs.value = plugin.options.attrs || {}

      editor.addModel(new Locale())
        .addModel(new LayoutTopModel())
        .addModel(new LayoutBottomModel())

      const layoutActivity = new LayoutActivityModel()
      layoutActivity.currentActivity.value = plugin.options.defaultActivity || 'explorer'
      layoutActivity.slots.tab.addItem({
        name: 'explorer',
        component: () => import('../modules/activity').then(m => m.ActivityExplorer),
      }).addItem({
        name: 'search',
        component: () => import('../modules/activity').then(m => m.ActivitySearch),
      })

      editor.addModel(layoutActivity)
    },
  })
  return plugin
}
