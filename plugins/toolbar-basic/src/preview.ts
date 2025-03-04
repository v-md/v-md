import type { ToolbarItemOptions, ToolbarItemsSetting } from '@v-md/core'

export function createPreviewToolbarPresetMap(): Record<string, ToolbarItemOptions> {
  return {
    '|': { type: 'split' },
  }
}

export function createPreviewToolbarPresetItems(): ToolbarItemsSetting[] {
  return [
  ]
}
