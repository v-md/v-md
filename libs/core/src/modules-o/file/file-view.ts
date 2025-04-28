import type { TippyComponent, TippyOptions } from 'vue-tippy'
import type { FileNode } from '.'
import type {
  FileNavMenuConfirmOptions,
  FileNavMenuItem,
} from './file-view.types'
import {
  isObjectLike,
} from '@v-md/shared'
import {
  computed,
  ref,
  shallowRef,
} from 'vue'
import { excludeRelativeLeafFiles } from './utils'

export class FileView {
  /** 文件原始节点 */
  raw: FileNode

  get editor() {
    return this.raw.manager.editor
  }

  get manager() {
    return this.raw.manager
  }

  /** 文件管理中心的 UI Model */
  get managerView() {
    return this.raw.manager.view
  }

  constructor(file: FileNode) {
    this.raw = file
    this.reloadMenuItems()
  }

  /** 有效的菜单项 */
  menuItems = shallowRef<FileNavMenuItem[]>([])

  /** 文件状态发生变化时调用，可以重置菜单项 */
  reloadMenuItems() {
    this.menuItems.value = this.managerView.menuItems.filter((item) => {
      if (typeof item === 'string') {
        return true
      }
      return item.enable ? item.enable(this.raw) : true
    })

    for (let i = 0; i < this.menuItems.value.length; i++) {
      const item = this.menuItems.value[i]
      if (typeof item === 'string') {
        const prevItem = this.menuItems.value[i - 1]
        const nextItem = this.menuItems.value[i + 1]

        if (!isObjectLike(prevItem) || !isObjectLike(nextItem)) {
          this.menuItems.value.splice(i, 1)
          i--
        }
      }
    }
  }

  /** 菜单组件引用 */
  menuEl = ref<TippyComponent>()

  showMenu() {
    this.menuEl.value?.show()
  }

  hideMenu() {
    this.menuEl.value?.hide()
  }

  setMenuProps(options: TippyOptions) {
    this.menuEl.value?.setProps(options)
  }

  /** 确认弹框引用 */
  confirmEl = ref<TippyComponent>()

  /** 触发确认弹框的方法。在组件上下文中被修改 */
  showConfirm: (options?: FileNavMenuConfirmOptions) => void = () => {}

  /** 关闭确认弹框 */
  hideConfirm() {
    this.confirmEl.value?.hide()
  }

  /** 是否在文件树中被选中 */
  active = computed(() => this.managerView.activeFiles.has(this.raw))

  /** 是否在文件树中聚焦 */
  focus = computed(() => this.managerView.focusFile.value === this.raw)

  /** 是否处于创建目录状态 */
  creatingFolder = computed(() => this.managerView.creatingFolderFile.value === this.raw)

  /** 是否处于创建文件状态 */
  creatingFile = computed(() => this.managerView.creatingFile.value === this.raw)

  /** 是否处于重命名状态 */
  renaming = computed(() => this.managerView.renamingFile.value === this.raw)

  /** 是否处于剪切状态 */
  cutting = computed(() => this.managerView.cuttingFile.value && this.managerView.clipboardFiles.has(this.raw))

  /** 是否展开 */
  expanded = ref(false)

  onClick(e: MouseEvent) {
    e.stopPropagation()
    this.managerView.activeFiles.clear()
    this.managerView.activeFiles.add(this.raw)
    this.managerView.focusFile.value = this.raw

    if (this.raw.isFolder.value) {
      this.expanded.value = !this.expanded.value
    }
    else if (this.manager.currentFile.value !== this.raw) {
      this.manager.currentFile.value = this.raw
    }
  }

  onCtrlClick(e: MouseEvent) {
    e.stopPropagation()
    this.managerView.activeFiles.add(this.raw)
    this.managerView.focusFile.value = this.raw
  }

  onRightClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    this.managerView.focusFile.value = this.raw
    if (!this.managerView.activeFiles.has(this.raw)) {
      this.managerView.activeFiles.clear()
    }

    if (this.menuItems.value.length <= 0) {
      return
    }

    this.setMenuProps({
      getReferenceClientRect: () => ({
        width: 0,
        height: 0,
        top: e.clientY,
        bottom: e.clientY,
        left: e.clientX,
        right: e.clientX,
      }),
    })

    this.showMenu()
  }

  onCreateFile() {
    this.raw.checkFolder()

    this.expanded.value = true
    this.managerView.creatingFolderFile.value = null
    this.managerView.creatingFile.value = this.raw
  }

  onCreateFolder() {
    this.raw.checkFolder()

    this.expanded.value = true
    this.managerView.creatingFile.value = null
    this.managerView.creatingFolderFile.value = this.raw
  }

  onCreateValidate(name: string, isFolder: boolean = false) {
    if (!name) {
      return `${isFolder ? '目录' : '文件'}名称不得为空`
    }

    const res = this.raw.getChildByName(name, isFolder)
    return res ? `${isFolder ? '目录' : '文件'} ${name} 已存在` : true
  }

  onCreateConfirm(name: string, isFolder: boolean = false, isValid: boolean = false) {
    this.managerView.creatingFile.value = null
    this.managerView.creatingFolderFile.value = null

    if (!isValid) {
      return
    }

    this.raw.create({
      name,
      isFolder,
    })
  }

  onUploadFile() {
    this.raw.checkFolder()

    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = true

    fileInput.click()

    const resolveFile = async (file: File) => {
      await this.raw.createFileByStream(file)
    }

    const handler = () => {
      if (!fileInput.files?.length) {
        fileInput.removeEventListener('change', handler)
        return
      }

      const promises: Promise<void>[] = []
      for (const file of fileInput.files) {
        promises.push(resolveFile(file))
      }

      Promise.allSettled(promises).then(() => {
        fileInput.removeEventListener('change', handler)
      })
    }

    fileInput.addEventListener('change', handler)
  }

  onRename() {
    this.managerView.renamingFile.value = this.raw
  }

  onRenameValidate(name: string) {
    if (!this.raw.parent.value) {
      return true
    }

    if (!name) {
      return `${this.raw.isFolder.value ? '目录' : '文件'}名称不得为空`
    }

    const res = this.raw.parent.value.getChildByName(name, this.raw.isFolder.value)
    return res && res !== this.raw ? `${this.raw.isFolder.value ? '目录' : '文件'} ${name} 已存在` : true
  }

  onRenameConfirm(name: string, isValid: boolean = false) {
    this.managerView.renamingFile.value = null

    if (!isValid) {
      return
    }

    this.raw.rename(name)
  }

  onDelete() {
    if (!this.raw.parent.value) {
      return
    }

    this.raw.parent.value.remove(this.raw)
  }

  onCopy() {
    // 复制时会清除剪切状态
    this.managerView.cuttingFile.value = false
    this.onClipboard()
  }

  onCut() {
    this.managerView.cuttingFile.value = true
    this.onClipboard()
  }

  /** 将文件放入剪切板 */
  onClipboard() {
    if (this.managerView.activeFiles.size) {
      this.managerView.clipboardFiles.clear()
      this.managerView.activeFiles.forEach((file) => {
        this.managerView.clipboardFiles.add(file)
      })
      return
    }

    if (this.managerView.focusFile.value) {
      this.managerView.clipboardFiles.clear()
      this.managerView.clipboardFiles.add(this.managerView.focusFile.value)
    }
  }

  onPaste() {
    this.raw.checkFolder()

    if (!this.managerView.clipboardFiles.size) {
      return
    }

    const filesToPaste = excludeRelativeLeafFiles(this.managerView.clipboardFiles)
    if (this.managerView.cuttingFile.value) {
      // 剪切
      filesToPaste.forEach((file) => {
        file.moveTo(this.raw)
      })
      this.managerView.cuttingFile.value = false
    }
    else {
      // 复制
      filesToPaste.forEach((file) => {
        file.copyTo(this.raw)
      })
    }

    this.expanded.value = true
  }
}
