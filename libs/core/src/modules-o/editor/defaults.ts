import type { EditorOptions } from './types'

export function defaultOptions(): EditorOptions {
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
