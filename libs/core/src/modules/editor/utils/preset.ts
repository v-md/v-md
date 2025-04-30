import type { Editor } from '../model/editor'
import { LayoutTop } from '../../layout-top/model/layout-top'
import { Locale } from '../../locale'

export function editorModelPreset(editor: Editor) {
  editor.addModel(new Locale())
  editor.addModel(new LayoutTop())
}
