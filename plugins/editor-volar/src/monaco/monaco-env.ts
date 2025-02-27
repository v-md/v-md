import type { Monaco } from '@v-md/core'
import type { EditorVolarOptions, WorkerMessage } from '../types'
import { resolveDynamicImport } from '@v-md/shared'

export function initMonacoEnv(editorMonaco: Monaco, pluginOptions: EditorVolarOptions) {
  const {
    locale,
    cdnUrl,
    cdnDataUrl,
    cdnType,
    tsVersion,
    vueVersion,
  } = editorMonaco.editor.options
  const {
    vueWorker,
    editorWorker,
  } = pluginOptions

  const selfObj = self as any

  if (!selfObj.MonacoEnvironment) {
    selfObj.MonacoEnvironment = {}
  }

  const originGetWorker = selfObj.MonacoEnvironment.getWorker
  selfObj.MonacoEnvironment.getWorker = async (_workerId: string, label: string) => {
    if (label === 'vue') {
      const worker = await resolveDynamicImport(vueWorker)

      const init = new Promise<void>((resolve) => {
        worker.addEventListener('message', (data) => {
          if (data.data === 'inited') {
            resolve()
          }
        })
        worker.postMessage({
          event: 'init',
          locale,
          cdnUrl,
          cdnDataUrl,
          cdnType,
          tsVersion,
          vueVersion,
        } satisfies WorkerMessage)
      })

      await init
      return worker
    }

    const originWorker = await originGetWorker?.()
    if (originWorker) {
      return originWorker
    }

    const defaultEditorWorker = await resolveDynamicImport(editorWorker)
    return defaultEditorWorker
  }
}
