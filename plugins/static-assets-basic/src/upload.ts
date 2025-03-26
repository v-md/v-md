import type { FileManager, FileNode } from '@v-md/core'
import { isFunction, isHttpUrl } from '@v-md/shared'
import { dataURLToFile } from '@v-md/shared/browser'

export function initRemoteUpload(files: FileManager) {
  const { editor } = files

  files.view.addMenuItem({
    name: 'uploadRemote',
    label: '远程上传静态资源',
    // 非代码类文件可以远程上传
    enable: file => !file.isFolder.value && !file.mime.value.startsWith('text/') && isFunction(editor.options.assetsUpload),
    onTrigger: (file) => {
      remoteUploadFile(file)
    },
  }, { before: 'create-folder' })
}

export function remoteUploadFile(file: FileNode) {
  const {
    view,
    content,
    editor,
  } = file

  view.hideMenu()

  if (isHttpUrl(content.value)) {
    return
  }

  const {
    assetsUpload,
  } = editor.options

  if (!assetsUpload) {
    return
  }

  const fileObj = dataURLToFile(content.value, file.name.value)
  if (!fileObj) {
    return
  }

  assetsUpload(fileObj, file).then((res) => {
    // 完成上传后，内容更新为上传后的地址
    file.content.value = res
  })
}
