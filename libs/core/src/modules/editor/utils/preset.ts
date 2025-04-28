import type { Editor } from '../model/editor'
import { LayoutTop } from '../../layout-top/model/layout-top'

export function editorModelPreset(editor: Editor) {
  editor.registerModel(new LayoutTop())
}
