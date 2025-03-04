import type {
  WatchHandle,
} from 'vue'
import type { Editor } from '../editor'
import type {
  ToolbarItemOptions,
  ToolbarItemsSetting,
  ToolbarProps,
  ToolbarType,
} from './types'
import { cloneDeep } from '@v-md/shared'
import {
  reactive,
} from 'vue'

export class Toolbar {
  /** 编辑器对象 */
  editor: Editor

  /** 标题栏类别 */
  type: ToolbarType

  get logger() {
    return this.editor.logger
  }

  /** 标题栏子选项预设列表 */
  presetMap: Record<string, ToolbarItemOptions> = {}

  /** 标题栏子选项默认排布 */
  presetItems: ToolbarItemsSetting[] = []

  /**
   * 标题栏 UI 关联对象
   * @reactive
   */
  props: ToolbarProps = reactive({
    visible: true,
    items: [],
  })

  private _stopPropsWatch: WatchHandle | null = null

  /**
   * 创建工具栏
   * @param editor 编辑器对象
   * @param type 标题栏类别
   */
  constructor(editor: Editor, type: ToolbarType) {
    this.editor = editor
    this.type = type

    this._initPromise = this.editor.init()
      .then(() => this.editor.emit('onToolbarInit', this))
      .then(() => {
        this._initProps()
        return this.editor.emit('onToolbarInitted', this)
      })
  }

  private _initPromise: Promise<void> | null = null

  /** 等待初始化完成 */
  async init() {
    return this._initPromise !== null ?
      this._initPromise :
        Promise.reject(new Error(`Toolbar ${this.type} has not initted`))
  }

  private _initProps() {
    const {
      visible = true,
      items = cloneDeep(this.presetItems),
    } = this.editor.options.toolbars[this.type] || {}

    this.props.visible = visible
    this.props.items = items
      .map((item) => {
        if (typeof item !== 'string') {
          return item
        }
        return cloneDeep(this.presetMap[item])
      })
      .filter(item => item)
  }

  destroy() {
    this._stopPropsWatch?.()
  }
}
