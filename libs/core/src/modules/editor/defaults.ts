import type { EditorOptionsResolved } from './types'

export function defaultOptions(): EditorOptionsResolved {
  return {
    value: '',
    plugins: () => {},
    toolbars: {},
    attrs: {},
    monacoOptions: {},
    locale: '',
    cdnUrl: 'https://cdn.jsdelivr.net/npm',
    cdnDataUrl: 'https://data.jsdelivr.com/v1',
    cdnType: 'jsdelivr',
    previewOptions: {},
  }
}
