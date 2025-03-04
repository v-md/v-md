import type { Monaco } from '@v-md/core'

export class WorkerHost {
  editorMonaco: Monaco

  constructor(editorMonaco: Monaco) {
    this.editorMonaco = editorMonaco
  }

  onFetchCdnFile(uri: string, text: string) {
    this.editorMonaco.getOrCreateMonacoModel(
      this.editorMonaco.monaco.Uri.parse(uri),
      undefined,
      text,
    )
  }
}
