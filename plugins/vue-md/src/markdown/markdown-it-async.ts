import type {
  Options,
  PluginWithParams,
  PresetName,
} from 'markdown-it'
import MarkdownIt from 'markdown-it'

// from: https://github.com/antfu/markdown-it-async/blob/main/src/index.ts

export interface MarkdownItAsyncOptions extends Omit<Options, 'highlight'> {
  /**
   * Highlighter function for fenced code blocks.
   * Highlighter `function (str, lang, attrs)` should return escaped HTML. It can
   * also return empty string if the source was not changed and should be escaped
   * externally. If result starts with <pre... internal wrapper is skipped.
   * @default null
   */
  highlight?: ((str: string, lang: string, attrs: string) => string | Promise<string>) | null | undefined
}

const placeholder = (id: string): string => `<pre>::markdown-it-async::${id}::</pre>`
const placeholderRe = /<pre>::markdown-it-async::(\w+)::<\/pre>/g

function randStr(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

export type MarkdownItASyncPlaceholderMap = Map<string, [promise: Promise<string>, str: string, lang: string, attrs: string]>

export type MarkdownItAsyncRenderPost = (
  instance: MarkdownItAsync,
  replacedStr: string,
  env: any,
  ...params: any[]
) => void | Promise<void>

export type PluginAsyncWithParams = (md: MarkdownItAsync, ...params: any[]) => void

interface MarkdownItAsyncPluginInfo {
  /** 插件注册名称 */
  registerName: string

  /** 插件 */
  plugin?: PluginAsyncWithParams

  /** 插件参数列表 */
  params?: any[]

  /** 插件高亮相关后置渲染逻辑 */
  renderPost?: MarkdownItAsyncRenderPost
}

interface MarkdownItAsyncPluginRegisterOptions extends MarkdownItAsyncPluginInfo {
  /**
   * 插入到指定名称插件之前。
   *
   * 若与 after 同时指定，则只有 before 生效。
   *
   * 若与 after 都不指定，则插件将插入到列表末尾。
   */
  before?: string

  /**
   * 插入到指定名称插件之后。
   *
   * 若与 before 同时指定，则只有 before 生效。
   *
   * 若与 before 都不指定，则插件将插入到列表末尾。
   */
  after?: string
}

export class MarkdownItAsync extends MarkdownIt {
  /** 从高亮占位 html 中提取占位 id */
  static getPlaceholderId(html: string) {
    const reg = new RegExp(placeholderRe, '')
    const match = html.match(reg)
    return match ? match[1] : ''
  }

  /**
   * 异步高亮索引集
   * @key 代码块的占位 id
   * @value [异步高亮 promise, 代码块字符串, 代码块语言, 代码块属性]
   */
  placeholderMap: MarkdownItASyncPlaceholderMap

  /**
   * 为了配合异步高亮，一些插件需要注册后置渲染逻辑。
   *
   * 此列表记录所有的后置渲染方法，以及插件的对应参数
   */
  private _asyncRenderSet = new Set<[MarkdownItAsyncRenderPost, any[]]>()

  constructor(presetName: PresetName, options?: MarkdownItAsyncOptions)
  constructor(options?: MarkdownItAsyncOptions)
  constructor(...args: any[]) {
    const map: MarkdownItASyncPlaceholderMap = new Map()
    const options = args.length === 2 ? args[1] : args[0]
    if (options && 'highlight' in options)
      options.highlight = wrapHightlight(options.highlight, map)
    super(...args as [])
    this.placeholderMap = map
  }

  private _pluginRegisterSet = new Set<string>()
  private _pluginSeq: MarkdownItAsyncPluginInfo[] = []

  logger = console

  register(options: MarkdownItAsyncPluginRegisterOptions) {
    const {
      registerName,
      before,
      after,
    } = options

    if (this._pluginRegisterSet.has(registerName)) {
      this.logger.warn(`Markdown-it plugin ${registerName} has been registered`)
      return this
    }

    this._pluginRegisterSet.add(registerName)

    const targetRegisterName = before || after
    if (!targetRegisterName) {
      // 未指定注册位置，添加到末尾
      this._pluginSeq.push(options)
      return this
    }

    const targetIndex = this._pluginSeq.findIndex(item => item.registerName === targetRegisterName)
    if (targetIndex < 0) {
      this.logger.warn(
        `Reference markdown-it plugin ${targetRegisterName} not found! The plugin ${registerName} will be inserted at the end.`,
      )
      return this
    }

    if (before) {
      this._pluginSeq.splice(targetIndex, 0, options)
    }
    else {
      this._pluginSeq.splice(targetIndex + 1, 0, options)
    }

    return this
  }

  initRegisterdPlugins() {
    this._pluginSeq.forEach(({ plugin, params, renderPost }) => {
      this.useAsync(plugin, params, renderPost)
    })
  }

  useAsync(plugin?: PluginAsyncWithParams, params: any[] = [], renderPost?: MarkdownItAsyncRenderPost) {
    if (plugin) {
      this.use(plugin as PluginWithParams, ...params)
    }

    if (renderPost) {
      this._asyncRenderSet.add([renderPost, params])
    }
    return this
  }

  async renderAsync(src: string, env?: any): Promise<string> {
    const result = this.render(src, env)

    // 适配 @mdit-vue 系列插件
    const replaced = await replaceAsync(result, placeholderRe, async (match, id) => {
      if (!this.placeholderMap.has(id))
        throw new Error(`Unknown highlight placeholder id: ${id}`)
      const [promise, _str, lang, _attrs] = this.placeholderMap.get(id)!
      const result = await promise || ''
      this.placeholderMap.delete(id)
      if (result.startsWith('<pre'))
        return result
      else
        return `<pre><code class="language-${lang}">${result}</code></pre>`
    })

    for (const [renderPost, params] of this._asyncRenderSet) {
      await renderPost(this, replaced, env, ...params)
    }

    // const template = env?.sfcBlocks?.template

    // if (template) {
    //   template.contentStripped = replaced
    //   template.content = `<template>${replaced}</template>`
    // }

    return replaced
  }
}

export function createMarkdownItAsync(presetName: PresetName, options?: MarkdownItAsyncOptions): MarkdownItAsync
export function createMarkdownItAsync(options?: MarkdownItAsyncOptions): MarkdownItAsync
export function createMarkdownItAsync(...args: any[]): MarkdownItAsync {
  return new MarkdownItAsync(...args)
}

// https://github.com/dsblv/string-replace-async/blob/main/index.js
export function replaceAsync(string: string, searchValue: RegExp, replacer: (...args: string[]) => Promise<string>): Promise<string> {
  try {
    if (typeof replacer === 'function') {
      const values: Promise<string>[] = []
      String.prototype.replace.call(string, searchValue, (...args) => {
        values.push(replacer(...args))
        return ''
      })
      return Promise.all(values).then((resolvedValues) => {
        return String.prototype.replace.call(string, searchValue, () => {
          return resolvedValues.shift() || ''
        })
      })
    }
    else {
      return Promise.resolve(
        String.prototype.replace.call(string, searchValue, replacer),
      )
    }
  }
  catch (error) {
    return Promise.reject(error)
  }
}

function wrapHightlight(highlight: MarkdownItAsyncOptions['highlight'], map: MarkdownItASyncPlaceholderMap): Options['highlight'] {
  if (!highlight)
    return undefined

  return (str, lang, attrs) => {
    const promise = highlight(str, lang, attrs)
    if (typeof promise === 'string')
      return promise
    const id = randStr()
    map.set(id, [promise, str, lang, attrs])
    return placeholder(id)
  }
}
