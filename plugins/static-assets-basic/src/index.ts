import type { Promisable } from '@v-md/shared'
import { definePlugin } from '@v-md/core'
import {
  extname,
  toPromise,
} from '@v-md/shared'
import { readFileAsDataURL } from '@v-md/shared/browser'
import { getStaticAssetsExtInfo } from './file-ext'
import {
  initRemoteUpload,
} from './upload'

declare module '@v-md/core' {
  interface EditorOptions {
    /**
     * 静态资源文件上传异步方法。
     * @param file 需要上传的文件。Web 文件对象
     * @returns resolve 代表上传成功，返回文件的 url 地址。reject 代表上传失败。
     *
     * @default undefined
     */
    assetsUpload?: (file: File) => Promisable<string>

    /**
     * 上传静态资源时，是否自动进行 HTTP 上传
     * @default false
     */
    assetsUploadAuto?: boolean
  }
}

export function staticAssetsPlugin() {
  const extInfo = getStaticAssetsExtInfo({})

  return definePlugin({
    name: 'static-assets-basic',

    onOptionsDefault: (editor) => {
      editor.options.assetsUpload = undefined
      editor.options.assetsUploadAuto = false
    },

    onFilesInit: (files) => {
      Object.assign(files.fileExtMap, extInfo)
      initRemoteUpload(files)
    },

    onFileUpload: async (file, files, result) => {
      const ext = extname(file.name)
      const mime = files.getFileExtInfo(ext, 'mime')
      // 非文本类的 mime 触发二进制文件上传
      if (mime.startsWith('text/')) {
        return
      }

      const {
        assetsUpload,
        assetsUploadAuto,
      } = files.editor.options

      result.name = file.name
      if (assetsUpload && assetsUploadAuto) {
        const url = await toPromise(assetsUpload, [file])
        result.content = url
      }
      else {
        const res = await readFileAsDataURL(file)
        result.content = res
      }
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
  remoteDownloadFile,
  remoteUploadFile,
} from './upload'
