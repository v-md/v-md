import type { editor } from 'monaco-editor-core'

export function defaultOptions(): editor.IStandaloneEditorConstructionOptions {
  return {
    automaticLayout: true,
    cursorSmoothCaretAnimation: 'on',
    scrollBeyondLastLine: false,
    tabSize: 2,
  }
}
