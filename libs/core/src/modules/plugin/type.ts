import type { Func } from '@v-md/shared'
import type { Editor } from '../editor/model/editor'
import type { Plugin } from '../plugin'

export interface PluginDefineOptions<
  O extends Record<string, any> = Record<string, any>,
> extends PluginEvents {
  /** 插件名称 */
  name: string

  /** 插件初始配置 */
  options?: O
}

/** 插件的声明周期钩子 */
export interface PluginEvents {
  /**
   * 当插件注册到编辑器时触发。
   *
   * 不支持异步返回。
   * @param editor 编辑器对象
   * @param plugin 当前注册的插件
   */
  onRegistered?: (editor: Editor, plugin: Plugin) => void

  /**
   * 插件从编辑器中移除前触发。
   *
   * 不支持异步返回
   * @param editor 编辑器对象
   * @param plugin 当前移除的插件
   */
  onRemove?: (editor: Editor, plugin: Plugin) => void
}

/** 获取某个插件钩子的参数 */
export type PluginEventParams<T extends keyof PluginEvents = keyof PluginEvents> =
  Exclude<PluginEvents[T], undefined> extends Func ? Parameters<Exclude<PluginEvents[T], undefined>> : []
