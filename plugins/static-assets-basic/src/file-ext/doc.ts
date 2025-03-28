import type { FileExtInfo } from '@v-md/core'

export function resolveDocExt(info: Record<string, FileExtInfo>) {
  const docExts = ['doc', 'docx', 'pdf', 'ppt', 'pptx', 'xls', 'xlsx']
  docExts.forEach((ext) => {
    info[ext] = {
      // 相关文档文件暂不支持在编辑器展示
      editorComponent: null,
    }
  })

  info.txt = {
    mime: 'text/plain',
  }
  info.yaml = {
    mime: 'text/yaml',
  }
}
