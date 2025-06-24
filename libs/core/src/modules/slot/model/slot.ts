import type {
  SequenceInsertOptions,
  SequenceRemoveOptions,
} from '@v-md/shared'
import type { SlotItemOptions } from '../types'
import {
  getItemFromSequence,
  insertIntoSequence,
  removeFromSequence,
} from '@v-md/shared'
import { reactive } from 'vue'
import { SlotItem } from './slot-item'

export class Slot {
  constructor() {
    return reactive(this) as Slot
  }

  items: SlotItem[] = []

  addItem(item: SlotItemOptions, options?: SequenceInsertOptions) {
    insertIntoSequence(this.items, new SlotItem(item), {
      ...options,
    })
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
}
