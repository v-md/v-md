import type { DynamicImportResolver, SequenceItem } from '@v-md/shared'
import type { Component } from 'vue'

export interface SlotItemOptions extends SequenceItem {
  /** 用户配置的，渲染到视图中的 vue 组件，支持配置为动态加载 */
  component: DynamicImportResolver<Component>
}

export interface SlotItem extends SlotItemOptions {
  /** 实际渲染到视图中的 vue 组件。若未完成加载，则取值为空 */
  renderComponent?: Component
}
