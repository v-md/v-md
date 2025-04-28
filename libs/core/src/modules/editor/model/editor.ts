import type {
  SequencePositionOptions,
} from '@v-md/shared'
import type { App } from 'vue'
import type { Model } from '../../model'
import type {
  Plugin,
  PluginEventParams,
  PluginEvents,
} from '../../plugin'
import {
  getItemFromSequence,
  insertIntoSequence,
  logger,
  removeFromSequence,
} from '@v-md/shared'
import {
  createApp,
  defineComponent,
  h,
  provide,
} from 'vue'
import { EDITOR_ERR_MSG } from '../utils/err-msg'
import { editorModelPreset } from '../utils/preset'
import { PROVIDE_KEY } from '../utils/use'

export class Editor {
  /**
   * 创建编辑器实例
   * @param preset 是否按照预设模式创建子模块。默认为 true
   */
  constructor(preset: boolean = true) {
    if (preset) {
      editorModelPreset(this)
    }
  }

  /** 编辑器应用 Vue APP 实例 */
  vueApp: App | null = null

  /**
   * 挂载编辑器 UI
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

      import('../view/editor.vue').then(({ default: EditorApp }) => {
        const Comp = defineComponent({
          setup() {
            provide(PROVIDE_KEY, editor)
            resolve(editor)
          },
          render() {
            return h(EditorApp)
          },
        })

        this.vueApp = createApp(Comp)
        this.vueApp.mount(target)
      })
    })
  }

  /** 插件列表 */
  private _plugins: Plugin[] = []

  /**
   * 根据插件名称搜索插件
   * @param name 插件名称
   * @returns 插件对象。如果未找到，则返回 `null`
   */
  getPlugin<O extends Record<string, any> = Record<string, any>>(name: string) {
    const target = getItemFromSequence(this._plugins, name)
    if (!target) {
      return null
    }
    return target as Plugin<O>
  }

  /**
   * 注册插件
   * @param plugin 插件对象
   * @param options 插件插入位置选项
   * @returns 编辑器实例，支持链式调用
   */
  use(plugin: Plugin, options?: SequencePositionOptions) {
    const isSuccess = insertIntoSequence(this._plugins, plugin, {
      onDuplicate: () => {
        logger.warn(EDITOR_ERR_MSG.PLUGIN_DUPLICATED(plugin.name))
      },
      onMissingTarget: (targetName) => {
        logger.warn(EDITOR_ERR_MSG.PLUGIN_INSERT_WARN(targetName, plugin.name))
      },
      ...options,
    })

    if (isSuccess) {
      plugin.bind(this)
      this.triggerSync('onRegistered', this, plugin)
    }
    return this
  }

  /**
   * 卸载插件
   * @param name 插件名称
   * @returns 编辑器实例，支持链式调用
   */
  eject(name: string) {
    removeFromSequence(this._plugins, name, {
      onNotFound: () => {
        logger.warn(EDITOR_ERR_MSG.PLUGIN_NOT_FOUND(name))
      },
      onBeforeRemove: (targetPlugin) => {
        this.triggerSync('onRemove', this, targetPlugin)
        targetPlugin.unbind()
      },
    })

    return this
  }

  /**
   * 异步触发插件的某个生命周期
   * @param name 生命周期名称
   * @param args 触发参数
   */
  async trigger<T extends keyof PluginEvents>(
    name: T,
    ...args: PluginEventParams<T>
  ) {
    for (let i = 0; i < this._plugins.length; i++) {
      const plugin = this._plugins[i]
      await plugin.trigger(name, ...args)
    }
  }

  /**
   * 同步触发插件的某个生命周期
   * @param name 生命周期名称
   * @param args 触发参数
   */
  triggerSync<T extends keyof PluginEvents>(
    name: T,
    ...args: PluginEventParams<T>
  ) {
    for (let i = 0; i < this._plugins.length; i++) {
      const plugin = this._plugins[i]
      plugin.triggerSync(name, ...args)
    }
  }

  /** 数据模块索引对象 */
  private _modelMap = new Map<string, Model>()

  /**
   * 根据名称搜索数据模块
   * @param name 模块名称
   * @returns 数据模块对象。如果未找到，则返回 `null`
   */
  findModel<T extends Model = Model>(name: string) {
    const target = this._modelMap.get(name)
    if (!target) {
      return null
    }
    return target as T
  }

  /**
   * 根据名称获取数据模块，未找到则抛出错误
   * @param name 模块名称
   * @returns 数据模块对象。
   */
  getModel<T extends Model = Model>(name: string) {
    const target = this.findModel<T>(name)
    if (!target) {
      throw new Error(EDITOR_ERR_MSG.MODEL_NOT_FOUND(name))
    }
    return target
  }

  /**
   * 插入模块
   * @param model 模块对象
   */
  registerModel(model: Model) {
    const modelExisted = this.findModel(model.modelName)
    if (modelExisted) {
      logger.warn(EDITOR_ERR_MSG.MODEL_DUPLICATED(model.modelName))
      return this
    }

    this._modelMap.set(model.modelName, model)
    model.bind(this)
    return this
  }

  /**
   * 移除模块。
   * @param name 模块名称
   */
  removeModel(name: string) {
    const targetModel = this.findModel(name)
    if (!targetModel) {
      logger.warn(EDITOR_ERR_MSG.MODEL_NOT_FOUND(name))
      return this
    }

    this._modelMap.delete(name)
    targetModel.unbind()
    return this
  }
}
