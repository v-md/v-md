import type { LanguageServiceEnvironment } from '@volar/monaco/worker'
import type { worker } from 'monaco-editor-core'
import type * as Typescript from 'typescript'
import type { CreateData, WorkerMessage } from '../types'
import type { WorkerHost } from './utils'
import { createTypeScriptWorkerLanguageService } from '@volar/monaco/worker'
import {
  createVueLanguagePlugin,
  getFullLanguageServicePlugins,
  resolveVueCompilerOptions,
} from '@vue/language-service'
import * as editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker'
import { URI } from 'vscode-uri'
import { createNpmFileSystem } from './volar-cdn'

type TsType = typeof Typescript

async function importTsFromCdn(
  cdnUrl: string,
  tsVersion: string,
) {
  const _module = globalThis.module
  ;(globalThis as any).module = { exports: {} }
  const tsUrl = `${cdnUrl}/typescript@${tsVersion}/lib/typescript.js`
  await import(/* @vite-ignore */ tsUrl)
  const ts = globalThis.module.exports
  globalThis.module = _module
  return ts as TsType
}

self.onmessage = async (msg: MessageEvent<WorkerMessage>) => {
  if (msg.data?.event !== 'init') {
    return
  }

  const {
    cdnUrl,
    cdnDataUrl,
    cdnType,
    tsVersion,
    locale,
  } = msg.data
  const ts = await importTsFromCdn(cdnUrl, tsVersion)
  self.postMessage('inited')

  editorWorker.initialize(
    (
      ctx: worker.IWorkerContext<WorkerHost>,
      { tsconfig, dependencies }: CreateData,
    ) => {
      const asFileName = (uri: URI) => uri.path
      const asUri = (fileName: string): URI => URI.file(fileName)
      const env: LanguageServiceEnvironment = {
        workspaceFolders: [URI.file('/')],
        locale,
        fs: createNpmFileSystem(
          {
            cdnUrl,
            cdnDataUrl,
            cdnType,
          },
          (uri) => {
            if (uri.scheme === 'file') {
              if (uri.path === '/node_modules') {
                return ''
              }
              else if (uri.path.startsWith('/node_modules/')) {
                return uri.path.slice('/node_modules/'.length)
              }
            }
          },
          pkgName => dependencies[pkgName],
          (path, content) => {
            ctx.host.onFetchCdnFile(
              asUri(`/node_modules/${path}`).toString(),
              content,
            )
          },
        ),
      }

      const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(
        tsconfig?.compilerOptions || {},
        '',
      )
      const vueCompilerOptions = resolveVueCompilerOptions(
        tsconfig.vueCompilerOptions || {},
      )

      return createTypeScriptWorkerLanguageService({
        typescript: ts,
        compilerOptions,
        workerContext: ctx,
        env,
        uriConverter: {
          asFileName,
          asUri,
        },
        languagePlugins: [
          createVueLanguagePlugin(
            ts,
            compilerOptions,
            vueCompilerOptions,
            asFileName,
          ),
        ],
        languageServicePlugins: getFullLanguageServicePlugins(ts),
        setup({ project }) {
          project.vue = { compilerOptions: vueCompilerOptions }
        },
      })
    },
  )
}
