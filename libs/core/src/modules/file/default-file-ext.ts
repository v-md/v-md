import type { FileExtInfo } from './types'

export function defaultFileExtMap(): Record<string, FileExtInfo> {
  return {}
}

export function defaultFileExtInfo(isFolder: boolean = false): Required<FileExtInfo> {
  return {
    icon: isFolder ?
        import('../../assets/icons/folder.svg').then(m => m.default) :
        import('../../assets/icons/file.svg').then(m => m.default),
    iconColor: '',
    lang: 'plaintext',
    editorComponent: 'CodeEditor',
  }
}
