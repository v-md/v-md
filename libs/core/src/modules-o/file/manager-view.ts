import type { Func } from '@v-md/shared'
import type { FileNode } from './file'
import type {
  FileNavMenuItem,
  FileNavMenuItemAddOptions,
} from './file-view.types'
import type { FileManager } from './manager'
import {
  ref,
  shallowReactive,
  shallowRef,
} from 'vue'
import { defaultFileNavMenu } from './default-file-nav-menu'

export class FileManagerView {
  raw: FileManager

  constructor(manager: FileManager) {
    this.raw = manager
    this._initKeyboard()
  }

  /** 菜单列表总配置 */
  menuItems: FileNavMenuItem[] = defaultFileNavMenu()

  addMenuItem(item: FileNavMenuItem, options?: FileNavMenuItemAddOptions) {
    const { before, after } = options || {}
    const targetName = before || after
    if (!targetName) {
      this.menuItems.push(item)
      return
    }

    const index = this.menuItems.findIndex(i => typeof i !== 'string' && i.name === targetName)
    if (index < 0) {
      this.menuItems.push(item)
      return
    }

    if (before) {
      this.menuItems.splice(index, 0, item)
    }
    else {
      this.menuItems.splice(index + 1, 0, item)
    }
  }

  deleteMenuItem(name: string) {
    const index = this.menuItems.findIndex(i => typeof i !== 'string' && i.name === name)
    if (index < 0) {
      return
    }
    this.menuItems.splice(index, 1)
  }

  private _disposeKeyboard: Func | null = null

  activeKeys = new Set<string>()

  private _initKeyboard() {
    const keydownHandler = (e: KeyboardEvent) => {
      this.activeKeys.add(e.code)

      this.menuItems.forEach((item) => {
        if (typeof item === 'string') {
          return
        }
        if (!item.keyboard) {
          return
        }

        const target = item.keyboard(this)
        if (!target) {
          return
        }

        const enabled = !item.enable ? true : item.enable(target)
        if (!enabled) {
          // TODO 在界面上展示不可操作的提示
          return
        }

        item.onTrigger?.(target)
      })
    }

    const keyupHandler = (e: KeyboardEvent) => {
      this.activeKeys.delete(e.code)
    }

    document.addEventListener('keydown', keydownHandler)
    document.addEventListener('keyup', keyupHandler)

    this._disposeKeyboard = () => {
      document.removeEventListener('keydown', keydownHandler)
      document.removeEventListener('keyup', keyupHandler)
    }
  }

  destroy() {
    this._disposeKeyboard?.()
  }

  /**
   * 记录所有激活的文件节点。
   *
   * 复制、粘贴、删除的目标
   * @reactive
   */
  activeFiles = shallowReactive(new Set<FileNode>())

  /**
   * 记录当前聚焦的文件节点
   */
  focusFile = shallowRef<FileNode | null>(null)

  /** 当前正在创建目录的文件节点 */
  creatingFolderFile = shallowRef<FileNode | null>(null)

  /** 当前正在创建文件的文件节点 */
  creatingFile = shallowRef<FileNode | null>(null)

  /** 当前正在重命名的文件节点 */
  renamingFile = shallowRef<FileNode | null>(null)

  /** 在剪切板中的文件 */
  clipboardFiles = shallowReactive(new Set<FileNode>())

  /** 正在处于剪切状态 */
  cuttingFile = ref(false)

  /** 点击导航区域外部触发 */
  onClickOutside() {
    this.focusFile.value = null
  }
}
