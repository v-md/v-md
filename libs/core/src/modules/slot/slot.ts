import type {
  SequenceInsertOptions,
  SequenceRemoveOptions,
} from '@v-md/shared'
import type {
  SlotItem,
  SlotItemOptions,
} from './type'
import {
  getItemFromSequence,
  insertIntoSequence,
  removeFromSequence,
  resolveDynamicImport,
} from '@v-md/shared'
import { reactive } from 'vue'

export class Slot {
  private _isSetup = false

  constructor() {
    // 由于 private 属性的缘故，此处类型转换有问题，故使用 unknown
    return reactive(this) as unknown as Slot
  }

  items: SlotItem[] = []

  addItem(item: SlotItemOptions, options?: SequenceInsertOptions) {
    const isInsert = insertIntoSequence(this.items, item, {
      ...options,
    })
    if (isInsert && this._isSetup) {
      this._loadItemComponent(item)
    }
    return this
  }

  removeItem(name: string, options?: SequenceRemoveOptions) {
    removeFromSequence(this.items, name, {
      ...options,
    })
    return this
  }

  getItem(name: string) {
    return getItemFromSequence(this.items, name)
  }

  setup() {
    this._isSetup = true
    this.items.forEach((item) => {
      this._loadItemComponent(item)
    })
  }

  unmount() {
    this._isSetup = false
  }

  private _loadItemComponent(item: SlotItem) {
    resolveDynamicImport(item.component).then((component) => {
      item.renderComponent = component
    })
  }
}
