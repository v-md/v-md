import type { Editor } from '../editor/model/editor'
import type {
  PluginDefineOptions,
  PluginEventParams,
  PluginEvents,
} from './type'
import { isFunction, toPromise } from '@v-md/shared'
import { reactive } from 'vue'
import { EDITOR_ERR_MSG } from '../editor/utils/err-msg'

export function definePlugin<O extends Record<string, any> = Record<string, any>>(options: PluginDefineOptions<O>) {
  return new Plugin(options)
}

export class Plugin<O extends Record<string, any> = Record<string, any>> {
  /** 插件名称 */
  name: string

  /**
   * 插件选项
   * @reactive
   */
  options: O

  private _events: PluginEvents = {}

  /** 事件监听器索引对象 */
  get events() {
    return this._events
  }

  constructor(options: PluginDefineOptions<O>) {
    const {
      options: opts,
      name,
      ...events
    } = options

    this.options = reactive(opts || {}) as O
    this.name = options.name
    Object.entries(events).forEach(([key, value]) => {
      const k = key as keyof PluginEvents
      this._events[k] = value
    })
  }

  /**
   * 根据事件名称查询监听器
   * @param name 事件名称
   * @returns 事件信息。如果不存在，则返回 null
   */
  getEvent<T extends keyof PluginEvents>(name: T) {
    return this._events[name] || null
  }

  /**
   * 异步触发插件的某项事件监听器
   * @param name 事件名称
   * @param args 触发参数
   * @returns 监听器返回结果
   */
  async trigger<T extends keyof PluginEvents>(
    name: T,
    ...args: PluginEventParams<T>
  ) {
    const event = this.getEvent(name)
    if (!event) {
      return
    }

    const res = await toPromise(event, args)
    return res
  }

  /**
   * 同步触发插件的某项事件监听器
   * @param name 事件名称
   * @param args 触发参数
   * @returns 监听器返回结果
   */
  triggerSync<T extends keyof PluginEvents>(
    name: T,
    ...args: PluginEventParams<T>
  ) {
    const event = this.getEvent(name)
    if (!event) {
      return
    }

    if (!isFunction(event)) {
      return
    }

    return (event as any)(...args)
  }

  private _editor?: Editor

  /** 编辑器实例 */
  get editor() {
    if (!this._editor) {
      throw new Error(EDITOR_ERR_MSG.NOT_READY)
    }
    return this._editor
  }

  bind(editor: Editor) {
    this._editor = editor
  }

  unbind() {
    delete this._editor
  }
}
