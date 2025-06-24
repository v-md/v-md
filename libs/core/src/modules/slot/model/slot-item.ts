import type { Component } from 'vue'
import type { SlotItemOptions } from '../types'
import { resolveDynamicImport } from '@v-md/shared'
import { computed, shallowRef } from 'vue'

export class SlotItem {
  options: SlotItemOptions

  name: string

  constructor(options: SlotItemOptions) {
    this.options = options
    this.name = options.name
  }

  private _renderComponent = shallowRef<Component | null>(null)

  renderComponent = computed<Component | null>(() => {
    if (this._renderComponent.value) {
      return this._renderComponent.value
    }

    resolveDynamicImport(this.options.component).then((component) => {
      this._renderComponent.value = component
    })

    return null
  })
}
