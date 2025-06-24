import type { DynamicImportResolver, SequenceItem } from '@v-md/shared'
import type { Component } from 'vue'

export interface SlotItemOptions extends SequenceItem {
  /** 用户配置的，渲染到视图中的 vue 组件，支持配置为动态加载 */
  component: DynamicImportResolver<Component>
}
