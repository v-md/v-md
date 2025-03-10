import type { App, InjectionKey } from 'vue'
import type {
  Plugin,
  PluginHooks,
  PluginInsertOptions,
  PluginScanResult,
} from '../plugin'
import type { ToolbarType } from '../toolbar'
import type { EditorOptions } from './types'
import {
  EventEmitter,
  isFunction,
} from '@v-md/shared'
import {
  createApp,
  defineComponent,
  h,
  inject,
  provide,
  reactive,
} from 'vue'
import { AppEditor } from '../../views/app-editor'
import { FileManager } from '../file'
import { Monaco } from '../monaco'
import { Toolbar } from '../toolbar'
import { defaultOptions } from './defaults'

const PROVIDE_KEY = Symbol('v-md-editor') as InjectionKey<Editor>

export class Editor extends EventEmitter<PluginHooks> {
  static init(options?: EditorOptions) {
    const editor = new Editor(options)
    return editor
  }

  static use() {
    const editor = inject(PROVIDE_KEY)
    if (!editor) {
      throw new Error('Editor has not been provided!')
    }
    return editor
  }

  logger = console

  /**
   * 编辑器的选项
   * @reactive
   */
  options: EditorOptions

  /** Monaco Editor 管理对象 */
  monaco: Monaco

  /** 文件系统对象 */
  files: FileManager

  /** 标题栏对象 */
  toolbars: Record<ToolbarType, Toolbar>

  constructor(options?: EditorOptions) {
    super()

    // 首先挂载所有插件
    options?.plugins?.(this)

    // 初始化选项
    this.options = reactive(defaultOptions())

    this._initPromise = this.emit('onOptionsDefault', this).then(() => {
      Object.assign(this.options, options)
      return this.emit('onOptionsResolved', this)
    })

    // 核心模块初始化
    this.files = new FileManager(this)
    this.monaco = new Monaco(this)
    this.toolbars = {
      editor: new Toolbar(this, 'editor'),
      preview: new Toolbar(this, 'preview'),
      files: new Toolbar(this, 'files'),
    }
  }

  private _initPromise: Promise<void> | null = null

  /** 等待初始化完成 */
  async init() {
    return this._initPromise !== null ?
      this._initPromise :
        Promise.reject(new Error('Editor options has not resolved'))
  }

  private _pluginMap = new Map<string, Plugin>()

  /**
   * 挂载插件
   * @param plugin 插件
   * @param options 插件挂载选项
   */
  use(plugin: Plugin, options: PluginInsertOptions = {}) {
    const targetPlugin = this._pluginMap.get(plugin.name)
    if (targetPlugin) {
      this.logger.warn(`Plugin ${plugin.name} has been registered!`)
      return this
    }

    this._pluginMap.set(plugin.name, plugin)

    const { before, after } = options
    const scanPluginName = before || after
    const scanPluginResult = this.scan(scanPluginName || '')
    if (scanPluginName && !scanPluginResult) {
      this.logger.warn(
        `Reference plugin ${scanPluginName} has not been registered! The plugin ${plugin.name} will be inserted at the end.`,
      )
    }

    Object.entries(plugin).forEach(([key, value]) => {
      if (!isFunction(value)) {
        return
      }

      const k = key as keyof PluginHooks
      const index = scanPluginResult?.[k] || -1
      if (index < 0) {
        this.on(k, value)
      }
      else if (before) {
        this.on(k, value, index)
      }
      else {
        this.on(k, value, index + 1)
      }
    })

    return this
  }

  /**
   * 卸载插件
   * @param pluginName 插件名称
   */
  eject(pluginName: string) {
    const plugin = this._pluginMap.get(pluginName)
    if (!plugin) {
      return this
    }

    this._pluginMap.delete(pluginName)
    Object.entries(plugin).forEach(([key, value]) => {
      if (!isFunction(value)) {
        return
      }
      this.off(key as keyof PluginHooks, value)
    })

    return this
  }

  /**
   * 检索插件
   * @param pluginName 插件名称
   * @returns 插件各生命周期钩子函数在队列中的索引。若插件不存在，返回 null
   */
  scan(pluginName: string) {
    const plugin = this._pluginMap.get(pluginName)
    if (!plugin) {
      return null
    }

    const result: PluginScanResult = { name: plugin.name }
    Object.entries(plugin).forEach(([key, value]) => {
      if (!isFunction(value)) {
        return
      }
      const k = key as keyof PluginHooks
      const index = this.eventIndex(k, value)
      if (index >= 0) {
        result[k] = index
      }
    })

    return result
  }

  private _vueApp: App | null = null

  /**
   * UI 挂载
   * @param el 挂载的元素，取值说明如下：
   * - 字符串：将作为选择器，查找页面中对应的元素
   * - HTMLElement：直接使用传入的元素
   */
  mount(el: string | HTMLElement = '#app') {
    // eslint-disable-next-line ts/no-this-alias
    const editor = this

    return new Promise<Editor>((resolve, reject) => {
      let target: HTMLElement | null = null
      if (typeof el === 'string') {
        target = document.querySelector(el)
      }
      else {
        target = el
      }

      if (!target) {
        reject(new Error('Target element not found'))
        return
      }

      const Comp = defineComponent({
        setup() {
          provide(PROVIDE_KEY, editor)
          resolve(editor)
        },
        render() {
          return h(AppEditor)
        },
      })

      this._vueApp = createApp(Comp)
      this._vueApp.mount(target)
    })
  }

  destroy() {
    this._vueApp?.unmount()

    this.monaco.destroy()
    this.files.destroy()
    Object.values(this.toolbars).forEach(toolbar => toolbar.destroy())

    this.emit('onDestroy', this).then(() => {
      this._pluginMap.forEach(plugin => this.eject(plugin.name))
      this.clearAllEvents()
    })
  }
}
