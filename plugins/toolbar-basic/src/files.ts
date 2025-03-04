import type { ToolbarItemOptions, ToolbarItemsSetting } from '@v-md/core'

export function createFilesToolbarPresetMap(): Record<string, ToolbarItemOptions> {
  return {
    '|': { type: 'split' },
  }
}

export function createFilesToolbarPresetItems(): ToolbarItemsSetting[] {
  return [
  ]
}
