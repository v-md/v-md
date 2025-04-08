import type { Func } from '@v-md/shared'
import type {
  WatchHandle,
} from 'vue'
import type { FileManager, FileNode } from '../file'
import type { PreviewEvent } from './types'
import {
  createSandboxIframe,
} from '@v-md/renderer'
import {
  debounce,
  EventEmitter,
  extname,
} from '@v-md/shared'
import {
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'
import { PreviewProxy } from './preview-proxy'
import htmlTemplate from './srcdoc.html?raw'

export class Preview extends EventEmitter<PreviewEvent> {
  manager: FileManager

  get logger() {
    return this.editor.logger
  }

  get editor() {
    return this.manager.editor
  }

  constructor(manager: FileManager) {
    super()
    this.manager = manager
  }

  /** 当前的关联文件，若发生变动则会触发重新编译与渲染 */
  relativeFiles = new Map<FileNode, boolean>()

  private _disposeFileChangeEvents: Func | null = null

  private _initFileChangeEvents() {
    this._disposeFileChangeEvents?.()

    const contentChangeHandler = (file: FileNode) => {
      if (!this.relativeFiles.has(file)) {
        return
      }

      // 内容变化，关联文件触发重新编译
      file.compiler.reset()
      this.update()
    }

    const remameHandler = (file: FileNode, name: string, oldName: string) => {
      if (!this.relativeFiles.has(file)) {
        return
      }

      // 文件路径发生变化
      const ext = extname(name, file.isFolder.value)
      const oldExt = extname(oldName, file.isFolder.value)
      if (ext !== oldExt) {
        // 文件扩展名发生变化，需要重新编译
        file.compiler.reset()
      }
      else {
        // 重命名，文件源码不变，重新编译模块即可
        file.compiler.resetModuleCompile()
      }

      this.update()
    }

    const moveHandler = (file: FileNode) => {
      if (!this.relativeFiles.has(file)) {
        return
      }

      // 移动文件不涉及源码变化，重新编译模块即可
      file.compiler.resetModuleCompile()
      this.update()
    }

    this.manager.on('onChange', contentChangeHandler)
    this.manager.on('onRename', remameHandler)
    this.manager.on('onMove', moveHandler)

    this._disposeFileChangeEvents = () => {
      this.manager.off('onChange', contentChangeHandler)
      this.manager.off('onRename', remameHandler)
      this.manager.off('onMove', moveHandler)
      this._disposeFileChangeEvents = null
    }
  }

  /** 预览容器的 DOM 元素 */
  viewerRef = ref<HTMLElement>()

  /** 预览沙盒对象 */
  sandbox: HTMLIFrameElement | null = null

  /** 预览沙盒通信对象 */
  proxy: PreviewProxy | null = null

  /** 预览组件内挂载文件系统 */
  setup() {
    let stopImportMapWatcher: WatchHandle | null = null
    onBeforeUnmount(() => {
      stopImportMapWatcher?.()
      this._destroySandbox?.()
    })

    this.on('onMounted', () => {
      this._createSandbox()

      // reset sandbox when import map changes
      const importMapFile = this.manager.keyFiles.importMap
      if (!importMapFile) {
        return
      }

      // 监听 import-map 变化，重新渲染
      stopImportMapWatcher = watch(importMapFile.content, debounce(() => {
        this._createSandbox()
      }, 300))
    })
  }

  private _destroySandbox: Func | null = null

  _createSandbox() {
    if (!this.viewerRef.value) {
      return
    }

    this._destroySandbox?.()

    const { options } = this.editor

    this.sandbox = createSandboxIframe({
      el: this.viewerRef.value,
      htmlTemplate,
      importMapTxt: this.manager.keyFiles.importMap?.content.value || '',
      headHtml: options.previewOptions?.headHtml || '',
      cdnUrl: options.cdnUrl,
    })

    this._createProxy()

    const sandboxLoadHandler = () => {
      this.proxy?.handle_links()
      this.update()
      this._initFileChangeEvents()
    }

    this._destroySandbox = () => {
      this.proxy?.destroy()
      this._disposeFileChangeEvents?.()

      if (!this.sandbox) {
        return
      }

      this.sandbox.removeEventListener('load', sandboxLoadHandler)

      if (this.viewerRef.value) {
        this.viewerRef.value.removeChild(this.sandbox)
      }
    }

    this.sandbox.addEventListener('load', sandboxLoadHandler)
  }

  /** 运行时错误信息 */
  runtimeError = ref<string>('')

  /** 运行时警告信息 */
  runtimeWarning = ref<string>('')

  _createProxy() {
    if (!this.sandbox) {
      return
    }

    this.proxy = new PreviewProxy(this.sandbox, {
      on_fetch_progress: (_progress: any) => {
        // pending_imports = progress;
      },
      on_error: (event: any) => {
        const msg =
          event.value instanceof Error ? event.value.message : event.value
        if (
          msg.includes('Failed to resolve module specifier') ||
          msg.includes('Error resolving module specifier')
        ) {
          this.runtimeError.value =
            `${msg.replace(/\. Relative references must.*$/, '')
            }.\nTip: edit the "Import Map" tab to specify import paths for dependencies.`
        }
        else {
          this.runtimeError.value = event.value
        }
      },
      on_unhandled_rejection: (event: any) => {
        let error = event.value
        if (typeof error === 'string') {
          error = { message: error }
        }
        this.runtimeError.value = `Uncaught (in promise): ${error.message}`
      },
      on_console: (log: any) => {
        if (log.duplicate) {
          return
        }
        if (log.level === 'error') {
          if (log.args[0] instanceof Error) {
            this.runtimeError.value = log.args[0].message
          }
          else {
            this.runtimeError.value = log.args[0]
          }
        }
        else if (log.level === 'warn') {
          if (log.args[0].toString().includes('[Vue warn]')) {
            this.runtimeWarning.value = log.args
              .join('')
              .replace(/\[Vue warn\]:/, '')
              .trim()
          }
        }
      },
      on_console_group: (_action: any) => {
        // group_logs(action.label, false);
      },
      on_console_group_end: () => {
        // ungroup_logs();
      },
      on_console_group_collapsed: (_action: any) => {
        // group_logs(action.label, true);
      },
    })
  }

  private _prevScrollTop = 0
  private _prevScrollLeft = 0

  /** 重新渲染 */
  async update() {
    if (!this.sandbox) {
      this.logger.error('Sandbox iframe not ready!')
      return
    }

    this.runtimeError.value = ''
    this.runtimeWarning.value = ''
    const mainFile = this.manager.keyFiles.main
    if (!mainFile) {
      this.logger.warn('No main file found for rendering!')
      return
    }

    try {
      this._prevScrollTop = this.sandbox.contentWindow?.scrollY || 0
      this._prevScrollLeft = this.sandbox.contentWindow?.scrollX || 0

      this.relativeFiles = await mainFile.compiler.compile()

      this.logger.info(
        `successfully compiled ${this.relativeFiles.size} module${
          this.relativeFiles.size > 1 ? `s` : ``
        }.`,
      )

      this.manager.generateCompiledCode(this.relativeFiles)

      // eval code in sandbox
      await this.proxy?.eval(mainFile.compiler.blobUrl)

      this.sandbox.contentWindow?.scrollTo({
        top: this._prevScrollTop,
        left: this._prevScrollLeft,
      })
    }
    catch (e: any) {
      this.logger.error(e)
      this.runtimeError.value = (e as Error).message
    }
  }

  /** 手动重置编译状态，并进行渲染 */
  reload() {
    this.relativeFiles.forEach((_, file) => {
      file.compiler.reset()
    })
    this.update()
  }

  destroy() {
    this._destroySandbox?.()
    this.clearAllEvents()
  }
}
