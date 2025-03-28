import type { FileNode } from '@v-md/core'
import { definePlugin } from '@v-md/core'
import { getStaticAssetsExtInfo } from './file-ext'
import {
  initRemoteUpload,
  remoteUploadFile,
} from './upload'

declare module '@v-md/core' {
  interface EditorOptions {
    /**
     * 静态资源文件上传异步方法。
     * @param file 需要上传的文件。Web 文件对象
     * @param node 相关文件对象
     * @returns resolve 代表上传成功，返回文件的 url 地址。reject 代表上传失败。
     *
     * @default undefined
     */
    assetsUpload?: (file: File, node: FileNode) => Promise<string>
  }
}

export function staticAssetsPlugin() {
  const extInfo = getStaticAssetsExtInfo({})

  return definePlugin({
    name: 'static-assets-basic',

    onOptionsDefault: (editor) => {
      editor.options.assetsUpload = undefined
    },

    onFilesInit: (files) => {
      Object.assign(files.fileExtMap, extInfo)
      initRemoteUpload(files)
    },

    onFileCompile: (_compiler, result, lang, code) => {
      // 尚未登记的后缀类型，都无法走静态资源编译流程
      if (!extInfo[lang]) {
        return
      }

      result.js = `export default ${JSON.stringify(code)}`
    },
  })
}

export {
  remoteUploadFile,
}
