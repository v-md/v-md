import type { Monaco } from '@v-md/core'
import type { WorkerLanguageService } from '@volar/monaco/worker'
import type { CreateData } from '../types'
import { debounce } from '@v-md/shared'
import {
  activateAutoInsertion,
  activateMarkers,
  registerProviders,
} from '@volar/monaco'
import { WorkerHost } from './utils'

export const DEFAULT_VOLAR_LANGUAGES = [
  'vue',
  'javascript',
  'typescript',
]

function getVolarLangs(editorMonaco: Monaco) {
  return editorMonaco.volarLangIds || DEFAULT_VOLAR_LANGUAGES
}

export function initMonacoLang(editorMonaco: Monaco) {
  const { monaco } = editorMonaco

  let hasVolarInitted: boolean = false
  let promise: Promise<void> | null = null
  editorMonaco.resetVolar = debounce(() => {
    if (hasVolarInitted) {
      return
    }

    if (promise) {
      hasVolarInitted = false
      return
    }

    promise = loadVolar(editorMonaco)
    promise.then(() => {
      hasVolarInitted = true
    }).finally(() => {
      promise = null
    })
  }, 250)

  // 特定的语言将会触发 volar 语言服务
  getVolarLangs(editorMonaco).forEach((lang) => {
    monaco.languages.onLanguage(lang, () => {
      editorMonaco.resetVolar?.()
    })
  })

  /** @todo tsconfig 改变时，重载 volar */
}

async function loadVolar(editorMonaco: Monaco) {
  const { monaco } = editorMonaco
  const { files, options } = editorMonaco.editor
  const { vueVersion = 'latest' } = options

  editorMonaco.disposeVolar?.()

  const dependencies: Record<string, string> = {
    'vue': vueVersion,
    '@vue/compiler-core': vueVersion,
    '@vue/compiler-dom': vueVersion,
    '@vue/compiler-sfc': vueVersion,
    '@vue/compiler-ssr': vueVersion,
    '@vue/reactivity': vueVersion,
    '@vue/runtime-core': vueVersion,
    '@vue/runtime-dom': vueVersion,
    '@vue/shared': vueVersion,
    'typescript': vueVersion,
  }

  const worker = monaco.editor.createWebWorker<WorkerLanguageService>({
    moduleId: 'vs/language/vue/vueWorker',
    label: 'vue',
    host: new WorkerHost(editorMonaco),
    createData: {
      tsconfig: files.keyFiles.tsconfig?.getJson() || {},
      dependencies,
    } satisfies CreateData,
  })

  const getSyncUris = () => {
    return files.root.getAllChildren().map(node => monaco.Uri.parse(`file://${node.path.value}`))
  }

  const markerDisposable = activateMarkers(
    worker,
    getVolarLangs(editorMonaco),
    'vue',
    getSyncUris,
    monaco.editor,
  )
  const autoInsertionDisposable = activateAutoInsertion(
    worker,
    getVolarLangs(editorMonaco),
    getSyncUris,
    monaco.editor,
  )
  const providersDisposable = await registerProviders(
    worker,
    getVolarLangs(editorMonaco),
    getSyncUris,
    monaco.languages,
  )

  editorMonaco.disposeVolar = () => {
    markerDisposable.dispose()
    autoInsertionDisposable.dispose()
    providersDisposable.dispose()
    editorMonaco.disposeVolar = null
  }
}
