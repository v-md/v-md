import type { InjectionKey } from 'vue'
import type { Editor } from '../models/editor'
import {
  inject,
} from 'vue'

export const EDITOR_PROVIDE_KEY = Symbol('v-md-editor') as InjectionKey<Editor>

/** 在编辑器的子组件中获取编辑器实例 */
export function useEditor() {
  const editor = inject(EDITOR_PROVIDE_KEY)
  if (!editor) {
    throw new Error('Editor has not mounted!')
  }
  return editor
}
