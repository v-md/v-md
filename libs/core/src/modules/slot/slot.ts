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
  items: SlotItem[] = reactive([])

  addSlotItem(item: SlotItemOptions, options?: SequenceInsertOptions) {
    insertIntoSequence(this.items, item, options)
    return this
  }

  removeSlotItem(name: string, options?: SequenceRemoveOptions) {
    removeFromSequence(this.items, name, options)
    return this
  }

  getSlotItem(name: string) {
    return getItemFromSequence(this.items, name)
  }

  setup() {
    this.items.forEach((item) => {
      resolveDynamicImport(item.component).then((component) => {
        item.renderComponent = component
      })
    })
  }
}
