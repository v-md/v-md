import {
  Editor,
  EDITOR_ERR_MSG,
  EDITOR_MODEL_NAMES,
  LayoutTop,
} from '@v-md/core'
import { describe, expect, it } from 'vitest'

describe('editor construct', () => {
  it('default scene of creating editor', () => {
    const editor = new Editor()
    expect(editor).toBeInstanceOf(Editor)
    expect(editor.getModel(EDITOR_MODEL_NAMES.LAYOUT_TOP)).toBeInstanceOf(LayoutTop)
  })

  it('should not initialize preset models when preset option is set false', () => {
    const editor = new Editor(false)
    expect(
      () => editor.getModel(EDITOR_MODEL_NAMES.LAYOUT_TOP),
    ).toThrow(
      EDITOR_ERR_MSG.MODEL_NOT_FOUND(EDITOR_MODEL_NAMES.LAYOUT_TOP),
    )
  })
})
