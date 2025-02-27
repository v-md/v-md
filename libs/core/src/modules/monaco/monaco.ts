import type { Func } from '@v-md/shared'
import type * as MonacoRaw from 'monaco-editor-core'
import type {
  WatchHandle,
} from 'vue'
import type { Editor } from '../editor'
import type { FileEvents } from '../file'
import type { MonacoEvents } from './types'
import {
  EventEmitter,
  extname,
} from '@v-md/shared'
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
} from 'vue'
import { defaultOptions } from './defaults'

export class Monaco extends EventEmitter<MonacoEvents> {
  /** 编辑器对象 */
  editor: Editor

  get logger() {
    return this.editor.logger
  }

  constructor(editor: Editor) {
    super()
    this.editor = editor

    this._initPromise = this.editor.init().then(async () => {
      await this._initDynamicLoad()

      this._initEditorOpener()
      this._initFileModelsListener()

      await this.editor.emit('onMonacoInit', this)
      await this.editor.emit('onMonacoInitted', this)
    })
  }

  private _disposeFileModelsListener: Func | null = null

  /** 确保每个文件在编辑器中对应一个 monaco model，使得语言服务能够识别文件位置 */
  private _initFileModelsListener() {
    const { files } = this.editor

    const moveHandler: FileEvents['onMove'] = (file, parent, oldParent) => {
      if (file.isFolder.value) {
        return
      }

      if (!oldParent && parent) {
        // 创建文件的场景
        this.getOrCreateMonacoModel(file.path.value, file.lang.value, file.content.value)
      }
      else if (oldParent && !parent) {
        // 删除文件的场景
        const oldPath = `${oldParent.path.value}/${file.name.value}`
        const model = this.getOrCreateMonacoModel(oldPath, file.lang.value, file.content.value)
        model?.dispose()
      }
      else if (oldParent && parent) {
        // 移动文件的场景
        const oldPath = `${oldParent.path.value}/${file.name.value}`
        const oldModel = this.getOrCreateMonacoModel(oldPath, file.lang.value, file.content.value)
        oldModel?.dispose()

        this.getOrCreateMonacoModel(file.path.value, file.lang.value, file.content.value)
      }
    }

    const renameHandler: FileEvents['onRename'] = (file, _name, oldName) => {
      if (file.isFolder.value) {
        return
      }

      // 重命名文件的场景
      const model = this.getOrCreateMonacoModel(file.path.value, file.lang.value, file.content.value)
      if (files.currentFile.value === file && this.editorInstance.value) {
        // 重命名文件为当前打开的文件时，需要重新设置新的编辑器 Model
        file.editorViewState = this.editorInstance.value.saveViewState()
        this.editorInstance.value.setModel(model)
        this.editorInstance.value.restoreViewState(file.editorViewState)
        this.editorInstance.value.focus()
      }

      const oldPath = `${file.dirPath.value}/${oldName}`
      const oldExt = extname(oldName)
      const oldLang = files.getLang(oldExt)
      const oldModel = this.getOrCreateMonacoModel(oldPath, oldLang, null)
      oldModel?.dispose()
    }

    files.on('onMove', moveHandler)
    files.on('onRename', renameHandler)

    this._disposeFileModelsListener = () => {
      files.off('onMove', moveHandler)
      files.off('onRename', renameHandler)
    }
  }

  private _initEditorOpener() {
    const { files } = this.editor
    this.monaco.editor.registerEditorOpener({
      openCodeEditor(_, resource) {
        if (resource.toString().startsWith('file:///node_modules')) {
          return true
        }

        const path = resource.path
        if (/^\//.test(path)) {
          const file = files.root.getNodeByPath(path)
          if (file !== files.currentFile.value) {
            files.currentFile.value = file
            return true
          }
        }

        return false
      },
    })
  }

  private _initPromise: Promise<void> | null = null

  /** Monaco 对象 */
  monaco!: typeof MonacoRaw

  /** 动态导入对象加载 */
  private async _initDynamicLoad() {
    this.monaco = await import('monaco-editor-core')
  }

  /**
   * 创建一个 Monaco Editor 编辑内容实例。
   *
   * 若 Monaco Editor 缓存中已有对应的实例缓存，则直接返回缓存内容
   * @param path 编辑内容对应路径
   * @param lang 编辑内容语言
   * @param value 内容，若设为 null 则不设置内容
   * @returns 编辑内容实例
   */
  getOrCreateMonacoModel(
    path: string | MonacoRaw.Uri,
    lang: string | undefined,
    value: string | null,
  ) {
    const { monaco } = this
    const uri = typeof path === 'string' ? monaco.Uri.parse(`file://${path}`) : path
    const model = monaco.editor.getModel(uri)
    if (model) {
      if (value !== null) {
        model.setValue(value)
      }
      return model
    }
    return monaco.editor.createModel(value || '', lang, uri)
  }

  /** 等待初始化完成 */
  async init() {
    return this._initPromise !== null ?
      this._initPromise :
        Promise.reject(new Error('Monaco has not initted'))
  }

  /** 编辑器 DOM 元素 */
  editorRef = ref<HTMLElement>()

  /** 编辑器实例 */
  editorInstance = shallowRef<MonacoRaw.editor.IStandaloneCodeEditor>()

  /** 组件内挂载 Monaco Editor */
  setup() {
    onBeforeUnmount(() => {
      this.editorInstance.value?.dispose()
      this.clearEvent('onMounted')
    })

    this.on('onMounted', () => {
      if (!this.editorRef.value) {
        throw new Error('Can not find target dom to mount Monaco Editor')
      }

      const instance = this.monaco.editor.create(this.editorRef.value, {
        ...defaultOptions(),
        ...this.editor.options.monacoOptions,
      })

      this.editorInstance.value = instance
    })

    this._useOptions()
    this._useEditorContent()
    this._useEditorFileChange()
  }

  /** 初始化编辑器选项监听 */
  private _useOptions() {
    let stopOptionsWatcher: WatchHandle | null = null
    onBeforeUnmount(() => {
      stopOptionsWatcher?.()
    })

    this.on('onMounted', () => {
      stopOptionsWatcher = watch(() => this.editor.options.monacoOptions, (options) => {
        this.editorInstance.value?.updateOptions(options)
      })
    })
  }

  /** 初始化编辑器内容修改监听 */
  private _useEditorContent() {
    const { files } = this.editor

    let contentSyncDisposable: MonacoRaw.IDisposable | null = null
    onBeforeUnmount(() => {
      contentSyncDisposable?.dispose()
    })

    this.on('onMounted', () => {
      if (!this.editorInstance.value) {
        return
      }
      const instance = this.editorInstance.value

      contentSyncDisposable = instance.onDidChangeModelContent(() => {
        if (!files.currentFile.value) {
          return
        }
        const { content } = files.currentFile.value
        content.value = instance.getValue()
      })
    })
  }

  /** 初始化编辑器文件变化监听 */
  private _useEditorFileChange() {
    const { files } = this.editor

    let stopContentWatcher: WatchHandle | null = null
    onBeforeUnmount(() => {
      stopContentWatcher?.()
    })

    this.on('onMounted', () => {
      if (!this.editorInstance.value) {
        return
      }
      const instance = this.editorInstance.value

      // 初始化编辑器首次编辑的内容
      if (!files.currentFile.value) {
        instance.setModel(null)
      }
      else {
        const file = files.currentFile.value

        // 创建首次编辑的内容
        const model = this.getOrCreateMonacoModel(
          file.path.value,
          file.lang.value,
          file.content.value,
        )
        instance.setModel(model)

        // 首次编辑的内容变化监听
        stopContentWatcher = watch(file.content, (val) => {
          if (val !== instance.getValue()) {
            instance.setValue(val)
          }
        })
      }
    })

    watch(files.currentFile, (file, oldFile) => {
      if (!this.editorInstance.value) {
        return
      }
      const instance = this.editorInstance.value

      stopContentWatcher?.()

      if (!file) {
        instance.setModel(null)
        return
      }

      const {
        path,
        lang,
        content,
      } = file

      // 文件切换时，先保存旧文件编辑状态
      if (oldFile) {
        oldFile.editorViewState = instance.saveViewState()
      }

      // 切换文件展示
      const model = this.getOrCreateMonacoModel(
        path.value,
        lang.value,
        content.value,
      )
      instance.setModel(model)

      // 恢复编辑状态
      if (file.editorViewState) {
        instance.restoreViewState(file.editorViewState)
        instance.focus()
      }

      // 内容改变，同步编辑器
      stopContentWatcher = watch(content, (val) => {
        if (val !== instance.getValue()) {
          instance.setValue(val)
        }
      })
    })
  }

  destroy() {
    this.editorInstance.value?.dispose()
    this._disposeFileModelsListener?.()
    this.clearAllEvents()
  }
}
