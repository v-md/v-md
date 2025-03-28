import type { FileExtInfo } from '@v-md/core'

export function resolveVideoExt(info: Record<string, FileExtInfo>) {
  const videoExts = ['mp4', 'webm', 'mkv', 'flv', 'avi', 'mov', 'wmv', 'm4v']
  videoExts.forEach((ext) => {
    info[ext] = {
      // 相关视频文件暂不支持在编辑器展示
      editorComponent: null,
    }
  })
}
