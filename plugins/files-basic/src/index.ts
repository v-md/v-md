import { definePlugin } from '@v-md/core'
import { createDefaultFiles } from './default-files'

export function filesBasicPlugin() {
  return definePlugin({
    name: 'files-basic',

    onFilesCreate: (files) => {
      const defaultFiles = createDefaultFiles(files)
      files.setContent(defaultFiles)
    },
  })
}
