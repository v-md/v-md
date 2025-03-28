import type { FileExtInfo } from '@v-md/core'

export function resolveAudioExt(info: Record<string, FileExtInfo>) {
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'amr', 'ape', 'alac', 'aiff', 'aifc', 'aif']
  audioExts.forEach((ext) => {
    info[ext] = {
      // 音频文件暂不支持在编辑器展示
      editorComponent: null,
    }
  })
}
