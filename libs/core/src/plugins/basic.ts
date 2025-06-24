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

  /** 编辑器根元素的 HTML 属性 */
  attrs?: HTMLAttributes
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
        .addModel(new LayoutActivityModel())
    },
  })
  return plugin
}
