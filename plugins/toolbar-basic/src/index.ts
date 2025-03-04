import { definePlugin } from '@v-md/core'
import {
  createEditorToolbarPresetItems,
  createEditorToolbarPresetMap,
} from './editor'
import {
  createFilesToolbarPresetItems,
  createFilesToolbarPresetMap,
} from './files'
import {
  createPreviewToolbarPresetItems,
  createPreviewToolbarPresetMap,
} from './preview'

export function toolbarBasicPlugin() {
  return definePlugin({
    name: 'toolbar-basic',

    onToolbarInit: (toolbar) => {
      if (toolbar.type === 'editor') {
        Object.assign(toolbar.presetMap, createEditorToolbarPresetMap())
        toolbar.presetItems.push(...createEditorToolbarPresetItems())
      }
      else if (toolbar.type === 'preview') {
        Object.assign(toolbar.presetMap, createPreviewToolbarPresetMap())
        toolbar.presetItems.push(...createPreviewToolbarPresetItems())
      }
      else {
        Object.assign(toolbar.presetMap, createFilesToolbarPresetMap())
        toolbar.presetItems.push(...createFilesToolbarPresetItems())
      }
    },
  })
}
