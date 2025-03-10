import type { EditorOptions, FileNode } from '@v-md/core'
import type { DynamicImportResolver } from '@v-md/shared'
import type { VueCompilerOptions } from '@vue/language-service'
import type { CompilerOptions } from 'typescript'

declare module '@v-md/core' {
  interface Monaco {
    /** Volar 语言服务支持的语言类型。填写 Monaco Editor 的语言标识 */
    volarLangIds?: string[]

    /** 重载 Volar 语言服务 */
    resetVolar?: (() => void) | null

    /** 销毁 Volar 语言服务 */
    disposeVolar?: (() => void) | null
  }

  interface EditorOptions {
    /**
     * Monaco Editor 语言服务所需 TypeScript 的版本号(与应用运行依赖的 TypeScript 版本无关)
     * @default 'latest'
     */
    tsVersion?: string

    /**
     * Monaco Editor 语言服务所需 Vue 的版本号(与应用运行依赖的 Vue 版本无关)
     * @default 'latest'
     */
    vueVersion?: string
  }

  interface KeyFileSet {
    /** tsconfig 文件 */
    tsconfig?: FileNode
  }
}

export interface EditorVolarOptions {
  /** 获取 vue 语言服务进程 */
  vueWorker: DynamicImportResolver<Worker>

  /** 获取 Monaco Editor 编辑器的基本进程(非 vue 相关语言生效)  */
  editorWorker: DynamicImportResolver<Worker>
}

type WorkerMessageData = Pick<
  EditorOptions,
  'cdnUrl' |
  'cdnType' |
  'cdnDataUrl' |
  'locale' |
  'vueVersion' |
  'tsVersion'
>

/** Monaco Editor 向 Vue 语言服务通信的数据对象 */
export interface WorkerMessage extends WorkerMessageData {
  event: 'init'
}

export interface CreateData {
  tsconfig: {
    compilerOptions?: CompilerOptions
    vueCompilerOptions?: Partial<VueCompilerOptions>
  }
  dependencies: Record<string, string>
}
