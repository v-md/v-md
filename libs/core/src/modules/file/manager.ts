import type {
  CompiledData,
} from '@v-md/renderer'
import type * as CompilerSfc from 'vue/compiler-sfc'
import type { Editor } from '../editor'
import type {
  FileEvents,
  FileExtInfo,
  FileOptions,
  KeyFileSet,
} from './types'
import {
  atou,
  EventEmitter,
  isArray,
  nameFromPath,
  parentFromPath,
  replacePathName,
  utoa,
} from '@v-md/shared'
import {
  computed,
  shallowRef,
} from 'vue'
import { Preview } from '../preview'
import {
  defaultFileExtInfo,
  defaultFileExtMap,
} from './default-file-ext'
import { FileNode } from './file'
import { FileManagerView } from './manager-view'

export class FileManager extends EventEmitter<FileEvents> {
  /** 编辑器对象 */
  editor: Editor

  get logger() {
    return this.editor.logger
  }

  /** 预览管理对象 */
  preview: Preview

  /** 对应的 UI model */
  view: FileManagerView

  /** 文件后缀名和语言标签的对应关系 */
  fileExtMap = defaultFileExtMap()

  /**
   * 当前编辑器展示的文件节点。为 null 表示不展示文件
   * @reactive
   */
  currentFile = shallowRef<FileNode | null>(null)

  /** 文件根目录节点 */
  root: FileNode

  /** 存放远程资源文件的目录 */
  nodeModules: FileNode

  /**
   * 文件查询 hashMap，用于提高查询时效率
   * @key 以 `file:` 或 `folder:` 开头，后面链接文件路径，作为唯一索引 key
   * @value 文件节点
   */
  childrenMap = new Map<string, FileNode>()

  constructor(editor: Editor) {
    super()

    this.editor = editor

    this.preview = new Preview(this)
    this.view = new FileManagerView(this)

    this.root = new FileNode(this, {
      name: '',
      isFolder: true,
      keyType: 'root',
    })
    this.nodeModules = this.root.create({
      name: 'node_modules',
      isFolder: true,
      keyType: 'nodeModules',
    })

    this._initPromise = this.editor.init().then(async () => {
      await this._initDynamicLoad()
      await this.editor.monaco.init()

      await this.editor.emit('onFilesInit', this)

      if (this.editor.options.value) {
        this.setContent(this.editor.options.value)
      }
      else {
        await this.editor.emit('onFilesCreate', this)
      }

      this.currentFile.value = this.keyFiles.index || null
      if (this.currentFile.value) {
        this.view.activeFiles.add(this.currentFile.value)
      }
      await this.editor.emit('onFilesInitted', this)
    })
  }

  compilerSfc!: typeof CompilerSfc

  /** 动态导入对象加载 */
  private async _initDynamicLoad() {
    this.compilerSfc = await import('vue/compiler-sfc')
  }

  private _initPromise: Promise<void> | null = null

  /** 等待初始化完成 */
  async init() {
    return this._initPromise !== null ?
      this._initPromise :
        Promise.reject(new Error('File system has not initted'))
  }

  /** 核心文件集合 */
  keyFiles: KeyFileSet = {}

  /**
   * 设置编辑器内容
   * @param value 编辑器内容。支持编码后的字符串或编码前的对象
   */
  setContent(value: string | FileOptions[]) {
    const isArrayValue = isArray(value)
    let fileOptions = isArrayValue ? value : []

    if (!isArrayValue) {
      fileOptions = JSON.parse(atou(value)) as FileOptions[]
    }

    for (let i = 0; i < fileOptions.length; i++) {
      const opt = fileOptions[i]
      this.root.create(opt)
    }
  }

  /** 所有文件的值(对象) */
  valueObject = computed(() => this.root.value.value.children || [])

  /** 所有文件的序列值，可传递给编辑组件，直接维持编辑状态 */
  value = computed(() => utoa(JSON.stringify(this.valueObject.value)))

  /** 编译后的代码内容 */
  compiledData = shallowRef<CompiledData>({
    importMap: {},
    codes: {},
    main: '',
  })

  /** 编译后代码的序列值，可传递给预览组件 */
  compiledValue = computed(() => {
    return utoa(JSON.stringify(this.compiledData.value))
  })

  /** 生成编译后的代码产物 */
  generateCompiledCode(relativeFiles: Map<FileNode, boolean>) {
    const compiledData: CompiledData = {
      importMap: this.keyFiles.importMap?.getJson() || {},
      codes: {},
      main: this.keyFiles.main?.path.value || '',
    }
    for (const [file] of relativeFiles) {
      compiledData.codes[file.path.value] = {
        js: file.compiler.rawJs,
        mem: Array.from(file.compiler.importSourcePositions),
      }
    }
    this.compiledData.value = compiledData
  }

  /**
   * 对于浏览器 esm 不支持的资源类型，根据远程资源地址，在 node_modules 目录下生成父文件目录(不生成文件)
   * @param url 远程资源地址
   * @return 生成父目录节点。
   */
  nodeModulesParentPath(url: string) {
    const urlWithoutProtocol = url.replace(/^https?:\/\//, '')
    const dirPath = parentFromPath(urlWithoutProtocol)
    return this.nodeModules.mkdir(dirPath, { keyType: 'nodeModules' })
  }

  /** 缓存对远程资源的 HTTP 请求结果，若获取到 null，代表对应 url 获取不到文件 */
  private _nodeModulesUrlCache = new Map<string, File | null>()

  /**
   * 指定目录节点，创建 node_modules 内文件。会根据下载 url 缓存文件内容结果
   * @param url 文件下载源
   * @param folderNode 创建文件的目录节点
   * @param filename 文件重命名。若此值非空，该文件名会替换下载源中的文件名作为最终 url，以应对下载源中的文件名与实际文件名不一致，需要尝试的情况
   * @returns 创建的文件，如果文件下载失败，返回 null
   */
  async nodeModulesFetchFile(url: string, folderNode: FileNode, filename: string = '') {
    folderNode.checkFolder()

    let name = filename
    if (!filename) {
      name = nameFromPath(url)
    }

    const target = folderNode.getChildByName(name)
    if (target) {
      return target
    }

    const finalUrl = replacePathName(url, name)
    let file = this._nodeModulesUrlCache.get(finalUrl)

    if (file === null) {
      return null
    }

    // 资源不在缓存中，再进行网络请求
    if (!file) {
      const res = await fetch(finalUrl, { method: 'GET' })
      if (!res.ok) {
        // 缓存失败结果
        this._nodeModulesUrlCache.set(finalUrl, null)
        return null
      }

      const blob = await res.blob()
      file = new File([blob], name)
      // 缓存成功结果
      this._nodeModulesUrlCache.set(finalUrl, file)
    }

    const node = await folderNode.createFileByStream(file, { keyType: 'nodeModules' })
    return node
  }

  /**
   * 对于浏览器 esm 不支持的资源类型，根据远程资源地址，在 node_modules 目录下生成文件或目录。
   *
   * 若文件已存在，则直接返回文件节点。
   * @param url 远程资源地址
   * @param isFolder 是否生成目录
   * @return 生成的文件或目录节点。
   */
  async nodeModulesFetch(url: string, isFolder: boolean = false) {
    const urlWithoutProtocol = url.replace(/^https?:\/\//, '')
    if (isFolder) {
      return this.nodeModules.mkdir(urlWithoutProtocol, { keyType: 'nodeModules' })
    }

    const parent = this.nodeModulesParentPath(url)
    if (!parent) {
      return null
    }
    const fileNode = await this.nodeModulesFetchFile(url, parent)
    return fileNode
  }

  /**
   * 根据文件后缀，获取相关信息
   * @param ext 文件后缀
   * @param infoKey 要获取的信息的键
   * @param isFolder 是否是目录
   */
  getFileExtInfo<K extends keyof FileExtInfo = keyof FileExtInfo>(
    ext: string,
    infoKey: K,
    isFolder: boolean = false,
  ) {
    const info = {
      ...defaultFileExtInfo(isFolder),
      ...this.fileExtMap[ext],
    }
    return info[infoKey]
  }

  destroy() {
    this.root.destroy()
    this.preview.destroy()
    this.view.destroy()
    this.clearAllEvents()
  }
}
