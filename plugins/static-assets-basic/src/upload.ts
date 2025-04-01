import type { FileManager, FileNode } from '@v-md/core'
import {
  isDataURL,
  isFunction,
  isHttpUrl,
  toPromise,
} from '@v-md/shared'
import {
  dataURLToFile,
  readFileAsDataURL,
} from '@v-md/shared/browser'

export function initRemoteUpload(files: FileManager) {
  const { editor } = files

  files.view.addMenuItem({
    name: 'upload-http',
    label: 'HTTP 上传',
    // 非代码类文件可以远程上传
    enable: file => isStaticAsset(file) &&
      isFunction(editor.options.assetsUpload) &&
      isDataURL(file.content.value),
    onTrigger: (file) => {
      remoteUploadFile(file)
    },
  }, { before: 'create-folder' })

  files.view.addMenuItem({
    name: 'download-dataurl',
    label: '下载为 dataURL',
    enable: file => isStaticAsset(file) &&
      isHttpUrl(file.content.value),
    onTrigger: (file) => {
      remoteDownloadFile(file)
    },
  }, { after: 'upload-http' })

  files.view.addMenuItem({
    name: 'copy-url',
    label: '复制 URL',
    enable: file => isStaticAsset(file),
    onTrigger: (file) => {
      file.view.hideMenu()
      navigator.clipboard.writeText(file.content.value)
    },
  }, { after: 'copy' })
}

/** 插件判断一个文件是否为二进制资源文件的方式 */
export function isStaticAsset(file: FileNode) {
  return !file.isFolder.value && !file.mime.value.startsWith('text/')
}

/**
 * 文件行为的拓展，将 dataURL 转为文件对象，然后调用远程上传获取 url 地址。
 * @param file
 */
export async function remoteUploadFile(file: FileNode) {
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

  const res = await toPromise(assetsUpload, [fileObj])
  file.content.value = res

  // 上传成功后，重新刷新菜单项状态
  file.view.reloadMenuItems()
}

/**
 * 文件行为的拓展，从 http url 下载文件转为 dataURL。
 * @param file
 */
export async function remoteDownloadFile(file: FileNode) {
  const {
    view,
    content,
  } = file

  view.hideMenu()

  if (!isHttpUrl(content.value)) {
    return
  }

  const res = await fetch(content.value)

  if (!res.ok) {
    throw new Error(`Download failed! ${res.statusText}`)
  }

  const blob = await res.blob()
  const url = await readFileAsDataURL(blob)

  file.content.value = url

  // 下载成功后，重新刷新菜单项状态
  file.view.reloadMenuItems()
}
