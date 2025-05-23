import type {
  JSONPath,
} from '@v-md/shared'
import type { editor } from 'monaco-editor-core'
import type {
  ComputedRef,
  WatchHandle,
} from 'vue'
import type { FileManager } from './manager'
import type {
  FileEditorComponentValue,
  FileMeta,
  FileOptions,
} from './types'
import {
  applyJsonEdits,
  basename,
  compareFileNames,
  debounce,
  extname,
  isAbsolutePath,
  joinPath,
  modifyJson,
  parseJson,
  resolveDynamicImport,
} from '@v-md/shared'
import {
  readFileAsText,
} from '@v-md/shared/browser'
import {
  computed,
  nextTick,
  ref,
  shallowReactive,
  shallowRef,
  watch,
} from 'vue'
import { Compiler } from '../compiler'
import { FileView } from './file-view'
import { getMapId } from './utils'

export class FileNode {
  /** 文件管理对象 */
  manager: FileManager

  get editor() {
    return this.manager.editor
  }

  /** 对应的编译器 */
  compiler: Compiler

  /** 对应的 UI model */
  view: FileView

  /**
   * 文件 / 目录名。
   *
   * 改名请勿直接修改此值，请调用 remame 方法，否则将会缺失很多必要操作，导致系统错误
   */
  name = ref('')

  /** 是否为目录 */
  isFolder = ref(false)

  /** 文件类型 {@link FileOptions.keyType} */
  keyType = ref<FileOptions['keyType']>(false)

  /** 文件内容。若为目录，则内容为空 */
  content = ref('')

  /** 文件元数据 */
  meta = ref<FileMeta>({})

  /** 文件值的对象 */
  value = computed(() => {
    const res: FileOptions = {
      name: this.name.value,
      isFolder: this.isFolder.value,
      content: this.content.value,
      meta: this.meta.value,
    }

    if (this.keyType.value) {
      res.keyType = this.keyType.value
    }

    if (this.children.length) {
      // node_modules 不可编辑，不被计入值
      res.children = this.children
        .filter(item => item.keyType.value !== 'nodeModules')
        .map(item => item.value.value)
    }
    return res
  })

  constructor(manager: FileManager, options?: FileOptions) {
    const {
      name = '',
      isFolder = false,
      keyType = false,
      content = '',
      meta = {},
    } = options || {}

    this.manager = manager
    this.name.value = name
    this.isFolder.value = isFolder
    this.content.value = content
    this.meta.value = meta

    this.keyType.value = keyType
    if (keyType && !this.manager.keyFiles[keyType]) {
      this.manager.keyFiles[keyType] = this
    }

    this.view = new FileView(this)
    this.compiler = new Compiler(this)

    this._initFileChange()
    this._initFileNavStyle()
    this._initFileEditorComponent()
  }

  private _stopWatchHandlers: WatchHandle[] = []

  /** 初始化文件内容、名称变化的监听 */
  private _initFileChange() {
    const contentHandler = watch(this.content, debounce((val, prevVal) => {
      this.manager.emit('onChange', this, val, prevVal)
    }, 300))
    this._stopWatchHandlers.push(contentHandler)
  }

  /** 文件在浏览面板中，小图标的样式 */
  iconStyles = ref<Record<string, string>>({})

  /** 初始化文件在浏览面板中的样式 */
  private _initFileNavStyle() {
    const styleHandler = watch([
      this.isFolder,
      this.ext,
    ], ([isFolder, ext]) => {
      const icon = this.manager.getFileExtInfo(ext, 'icon', isFolder)
      const iconColor = this.manager.getFileExtInfo(ext, 'iconColor', isFolder)
      this.iconStyles.value.color = iconColor
      resolveDynamicImport(icon).then((res) => {
        this.iconStyles.value['--vmd-icon'] = `url("${res}")`
      })
    }, { immediate: true })

    this._stopWatchHandlers.push(styleHandler)
  }

  /** 展示文件内容的组件 */
  editorComponent = shallowRef<FileEditorComponentValue>('CodeEditor')

  /** Monaco Editor 编辑区是否可用 */
  editorEnabled = computed(() => this.editorComponent.value === 'CodeEditor')

  /** 初始化文件在主面板中展示的组件 */
  private _initFileEditorComponent() {
    const editorCompHandler = watch([
      this.isFolder,
      this.ext,
    ], ([isFolder, ext]) => {
      const editorComponent = this.manager.getFileExtInfo(ext, 'editorComponent', isFolder)
      if (typeof editorComponent === 'string') {
        this.editorComponent.value = editorComponent
      }
      else {
        resolveDynamicImport(editorComponent).then((res) => {
          this.editorComponent.value = res
        })
      }
    }, { immediate: true })

    this._stopWatchHandlers.push(editorCompHandler)
  }

  /** 销毁文件 */
  destroy() {
    this.parent.value = null
    this._stopWatchHandlers.forEach(handler => handler())

    // 自身销毁时，也要删除销毁子文件
    this.children.forEach((child) => {
      this.remove(child)
    })
  }

  /** 进行操作节点是否为目录的检查，非目录的场景下抛出错误 */
  checkFolder() {
    if (!this.isFolder.value) {
      throw new Error(`Target ${this.name.value} must be a folder`)
    }
  }

  /** 父节点目录 */
  parent = shallowRef<FileNode | null>(null)

  /** 子文件 / 目录列表 */
  children = shallowReactive<FileNode[]>([])

  /** 完整路径，以 / 为开头的绝对路径 */
  path: ComputedRef<string> = computed(() => {
    if (!this.parent.value) {
      return this.name.value
    }
    return `${this.dirPath.value}/${this.name.value}`
  })

  /** 所在目录路径，以 / 为开头的绝对路径 */
  dirPath: ComputedRef<string> = computed(() => {
    if (!this.parent.value) {
      return ''
    }
    return this.parent.value.path.value
  })

  /** 文件在 hashMap 中的索引键 */
  get mapId() {
    return getMapId(this.path.value, this.isFolder.value)
  }

  /**
   * 重命名文件。会触发 onRename
   */
  rename(name: string) {
    const oldName = this.name.value
    const oldMapId = this.mapId
    this.name.value = name

    this.manager.childrenMap.delete(oldMapId)
    this.manager.childrenMap.set(this.mapId, this)

    this.manager.emit('onRename', this, name, oldName)
  }

  /**
   * 插入子文件 / 目录
   * @param index 插入子文件 / 目录列表的索引位置
   * @param file 待插入的文件 / 目录
   */
  private _insertToIndex(index: number, file: FileNode) {
    this.children.splice(index, 0, file)
    file.parent.value = this
    this.manager.childrenMap.set(file.mapId, file)
  }

  /** 移除子文件 / 目录 */
  private _deleteFromIndex(index: number) {
    const file = this.children.splice(index, 1)[0]
    if (file) {
      file.parent.value = null
      this.manager.childrenMap.delete(file.mapId)
    }
  }

  /**
   * 在子文件排序列表中，第一个文件位置。
   *
   * 对于文件，永远返回 -1
   */
  firstFileIndex = computed(() => {
    if (!this.isFolder.value) {
      return -1
    }

    const index = this.children.findIndex(item => !item.isFolder.value)
    return index >= 0 ? index : this.children.length
  })

  /** 目录列表 */
  childFolders = computed(() => {
    return this.children.slice(0, this.firstFileIndex.value)
  })

  /** 文件列表 */
  childFiles = computed(() => {
    return this.children.slice(this.firstFileIndex.value)
  })

  /**
   * 新建文件。会触发 onMove 事件
   *
   * 若发生重名，则新文件的名称会自动加上序号
   * @param options 新文件选项
   * @returns 新建的文件节点
   */
  create(options?: FileOptions) {
    this.checkFolder()

    const file = new FileNode(this.manager, options)
    const fileName = this.getUniqueNameInFolder(file.name.value, file.isFolder.value)
    file.name.value = fileName
    this.add(file)

    // 递归创建子节点
    const { children = [] } = options || {}
    if (children.length) {
      children.forEach(item => file.create(item))
    }

    // 使用 nextTick，确保 path、dirPath 等属性已经更新
    nextTick(() => {
      this.manager.emit('onMove', file, this, null)
    })

    return file
  }

  /**
   * 从 File 文件对象创建文件
   * @param file 二进制流，浏览器文件对象
   * @param options 文件创建补充选项
   */
  async createFileByStream(file: File, options?: FileOptions) {
    this.checkFolder()

    const fileCreateOptions: FileOptions = {}
    await this.editor.emit('onFileStream', file, this.manager, fileCreateOptions)

    // 配置项未正确设置，按默认配置创建文件
    if (!fileCreateOptions.name) {
      fileCreateOptions.name = file.name
      fileCreateOptions.content = await readFileAsText(file)
    }

    return this.create({
      ...fileCreateOptions,
      ...options,
      isFolder: false,
    })
  }

  /**
   * 复制本文件到另一个目录下
   * @param to 目标目录
   */
  copyTo(to: FileNode) {
    to.checkFolder()
    to.create({
      ...this.value.value,
      keyType: false,
    })
  }

  /** 添加文件节点 */
  add(file: FileNode) {
    this.checkFolder()

    let added = false
    if (file.isFolder.value) {
      for (let i = 0; i < this.childFolders.value.length; i++) {
        const cur = this.childFolders.value[i]
        if (cur.name.value === file.name.value) {
          throw new Error(`Folder ${file.name.value} already exists`)
        }

        if (compareFileNames(file.name.value, cur.name.value) < 0) {
          this._insertToIndex(i, file)
          added = true
          break
        }
      }

      if (!added) {
        this._insertToIndex(this.firstFileIndex.value, file)
      }
    }
    else {
      for (let i = 0; i < this.childFiles.value.length; i++) {
        const cur = this.childFiles.value[i]
        if (cur.name.value === file.name.value) {
          throw new Error(`File ${file.name.value} already exists`)
        }

        if (compareFileNames(file.name.value, cur.name.value) < 0) {
          this._insertToIndex(this.firstFileIndex.value + i, file)
          added = true
          break
        }
      }

      if (!added) {
        this._insertToIndex(this.children.length, file)
      }
    }
  }

  /**
   * 移除文件。在销毁场景会触发 onMove 事件
   * @param file 待删除的文件
   * @param destroy 是否销毁。某些场景(例如移动文件)调用此方法时，需要设为 false(不销毁节点)
   */
  remove(file: FileNode, destroy: boolean = true) {
    this.checkFolder()

    const index = this.children.findIndex(cur => cur === file)
    if (index < 0) {
      throw new Error(`File ${file.name.value} not found`)
    }

    this._deleteFromIndex(index)

    if (destroy) {
      file.destroy()

      // 使用 nextTick，确保 path、dirPath 等属性已经更新
      nextTick(() => {
        this.manager.emit('onMove', file, null, this)
      })
    }
  }

  /**
   * 移动本文件到另一目录下。会触发 onMove 事件
   * @param to 目标目录
   */
  moveTo(to: FileNode) {
    to.checkFolder()

    if (!this.parent.value) {
      throw new Error('Cannot move root node!')
    }

    const oldParent = this.parent.value
    if (oldParent === to) {
      return
    }

    this.parent.value.remove(this, false)
    to.add(this)

    const emitMove = (node: FileNode) => {
      this.manager.emit('onMove', node, node.parent.value, oldParent)
      node.children.forEach((child) => {
        emitMove(child)
      })
    }

    // 使用 nextTick，确保触发时 path、dirPath 等属性已经更新
    nextTick(() => {
      emitMove(this)
    })
  }

  /**
   * 根据名称，在当前文件夹下寻找对应的文件节点
   * @param name 名称
   * @param isFolder 寻找目标是否为目录
   */
  getChildByName(name: string, isFolder: boolean = false) {
    if (!this.isFolder.value) {
      return null
    }

    const path = `/${joinPath(this.path.value, name)}`
    const mapId = getMapId(path, isFolder)
    return this.manager.childrenMap.get(mapId) || null
  }

  /**
   * 根据路径，在整个文件系统中寻找对应的文件节点
   * @param src 路径。绝对路径以 / 开头，相对路径以 . 或 .. 开头
   * @param isFolder 寻找目标是否为目录
   * @returns 对应文件节点
   */
  getNodeByPath(src: string, isFolder: boolean = false) {
    const isAbsolute = isAbsolutePath(src)
    const absolutePath = isAbsolute ? src : `/${joinPath(this.dirPath.value, src)}`
    const mapId = getMapId(absolutePath, isFolder)
    return this.manager.childrenMap.get(mapId) || null
  }

  /**
   * 根据路径，递归地创建目录
   * @param src 路径。绝对路径以 / 开头，相对路径以 . 或 .. 开头
   * @param options 新建目录创建时的额外选项
   * @returns 创建目录节点
   */
  mkdir(src: string, options?: FileOptions) {
    const isAbsolute = isAbsolutePath(src)
    if (!this.isFolder.value && !isAbsolute) {
      // 非目录节点无法使用相对路径创建目录
      return null
    }

    const absolutePath = isAbsolute ? src : `/${joinPath(this.path.value, src)}`
    const pathArr = absolutePath.split('/').filter(Boolean)
    let curNode = this.manager.root
    pathArr.forEach((section) => {
      const target = curNode.getChildByName(section, true)
      if (!target) {
        curNode = curNode.create({
          name: section,
          isFolder: true,
          ...options,
        })
      }
      else {
        curNode = target
      }
    })

    return curNode
  }

  /**
   * 获取所有子孙节点，并拍平为列表。不包含节点本身
   * @param mode 节点类型：
   * - folders-only：只获取文件夹
   * - files-only：只获取文件
   * - all：获取所有节点
   * @returns 符合要求的节点列表
   */
  getAllChildren(mode: 'folders-only' | 'files-only' | 'all' = 'all') {
    const result: FileNode[] = []
    if (!this.isFolder.value) {
      return result
    }

    const stack: FileNode[] = [...this.children]

    while (stack.length > 0) {
      const cur = stack.pop()
      if (!cur) {
        break
      }

      if (mode === 'all') {
        result.push(cur)
      }
      else if (mode === 'folders-only' && cur.isFolder.value) {
        result.push(cur)
      }
      else if (mode === 'files-only' && !cur.isFolder.value) {
        result.push(cur)
      }

      if (cur.isFolder.value) {
        stack.push(...cur.children)
      }
    }

    return result
  }

  /** 无后缀文件名称 */
  basename = computed(() => basename(this.name.value))

  /** 文件名后缀 */
  ext = computed(() => extname(this.name.value, this.isFolder.value).toLocaleLowerCase())

  /** 文件相关语言 */
  lang = computed(() => this.manager.getFileExtInfo(this.ext.value, 'lang'))

  /** 文件的 MIME 类型 */
  mime = computed(() => this.manager.getFileExtInfo(this.ext.value, 'mime'))

  /** 编辑器中的编辑状态 */
  editorViewState: editor.ICodeEditorViewState | null = null

  /**
   * 若文件为 JSON，获取 JSON 对象
   * @param thrown 是否在 JSON 转换出错时，抛出错误
   * @returns JSON 对象
   */
  getJson<T extends Record<string, any> = Record<string, any>>(thrown: boolean = true): T {
    if (this.ext.value !== 'json') {
      return {} as T
    }

    try {
      return parseJson(this.content.value)
    }
    catch (e) {
      if (thrown) {
        throw e
      }
      return {} as T
    }
  }

  /**
   * 若文件为 JSON，设置 JSON 对象，将设置后的值同步到文件内容
   * @param keys
   * @param value
   */
  setJson(keys: JSONPath, value: any) {
    if (this.ext.value !== 'json') {
      return
    }

    const diff = modifyJson(this.content.value, keys, value, {
      formattingOptions: {
        insertSpaces: true,
        tabSize: 2,
      },
    })
    this.content.value = applyJsonEdits(this.content.value, diff)
  }

  /**
   * 获取该目录下不重复的 文件/目录 名
   * @param originName 原始 文件/目录 名
   * @param isFolder 重复判定范围是文件还是目录
   */
  getUniqueNameInFolder(originName: string, isFolder: boolean = false) {
    if (!this.isFolder.value) {
      throw new Error('File is not a folder!')
    }

    let originFile: FileNode | null = null
    let curName = originName
    let isUnique = false
    let index = 1
    while (!isUnique) {
      const res = this.getChildByName(curName, isFolder)
      if (!res) {
        isUnique = true
      }
      else {
        if (!originFile) {
          originFile = res
        }
        const ext = res.ext.value ? `.${res.ext.value}` : ''
        curName = `${originFile.basename.value}-${index}${ext}`
        index++
      }
    }

    return curName
  }
}
