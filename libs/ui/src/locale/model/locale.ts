import type {
  LocaleDict,
  LocaleDictFlat,
  LocaleMap,
  LocaleModule,
  LocaleModuleMap,
  LocaleOptions,
} from '../types/locale'
import {
  isObjectLike,
  logger,
  resolveDynamicImport,
} from '@v-md/shared'
import { reactive, ref, watch } from 'vue'
import { LOCALE_ERR_MSG } from '../utils/err-msg'

export class Locale {
  /**
   * 本地化字典
   * @key 语言名称
   * @value 本地化字典
   */
  private _localeMap: LocaleMap = reactive({})

  /** 当前语言 */
  lang = ref('')

  constructor(options?: LocaleOptions) {
    const {
      lang = 'zh_cn',
      modules = {},
    } = options || {}

    this.lang.value = lang
    Object.entries(modules).forEach(([key, value]) => {
      this.addModel(key, value)
    })
  }

  /**
   * 为某种语言拓展本地化字典
   * @param lang 语言标识
   * @param dict 字典原始对象。解析完成后会覆盖原有字典
   * @returns 支持链式调用
   */
  add(lang: string, dict: LocaleDict) {
    const targetDict = this._localeMap[lang]
    if (!targetDict) {
      this._localeMap[lang] = this._flatDict(dict)
      return this
    }

    Object.assign(targetDict, this._flatDict(dict))
    return this
  }

  /**
   * 拍平字典数据
   * @param dict 待处理的字典原始对象
   * @param result 拍平后的字典对象
   * @param parentKey 父级键名
   * @returns 拍平后的字典对象
   */
  private _flatDict(dict: LocaleDict, result: LocaleDictFlat = {}, parentKey = '') {
    Object.entries(dict).forEach(([key, value]) => {
      const k = parentKey ? `${parentKey}.${key}` : key
      if (isObjectLike(value)) {
        this._flatDict(value, result, k)
      }
      else {
        result[k] = value
      }
    })
    return result
  }

  /**
   * 保存翻译模块索引
   * @key 模块名称
   * @value 模块状态
   */
  private _moduleMap = new Map<string, LocaleModule>()

  getModel(name: string) {
    return this._moduleMap.get(name) || null
  }

  addModel(name: string, map: LocaleModuleMap) {
    const state = this.getModel(name)
    if (state) {
      return this
    }

    const _activeLang = new Set<string>()

    Object.keys(map).forEach((lang) => {
      _activeLang.add(lang)
    })

    const _stopWatch = watch(() => this.lang.value, (lang) => {
      const targetDict = map[lang]
      if (!targetDict) {
        return
      }

      if (_activeLang.has(lang)) {
        return
      }

      resolveDynamicImport(targetDict).then((dict) => {
        this.add(lang, dict)
      })
    }, { immediate: true })

    this._moduleMap.set(name, {
      name,
      map,
      _activeLang,
      _stopWatch,
    })

    return this
  }

  destroy() {
    this._moduleMap.forEach((state) => {
      state._activeLang.clear()
      state._stopWatch()
      this._moduleMap.delete(state.name)
    })
  }

  /**
   * 获取翻译文本
   * @param key 字典索引
   * @param defaultText 若翻译失败，显示的文本
   * @returns 翻译文本
   */
  t(key: string, defaultText: string = '') {
    const dict = this._localeMap[this.lang.value]
    const textWhenFailed = defaultText || key
    if (!dict) {
      logger.warn(LOCALE_ERR_MSG.LANG_NOT_FOUND(this.lang.value))
      return textWhenFailed
    }

    const message = dict[key]
    if (!message) {
      logger.warn(LOCALE_ERR_MSG.KEY_NOT_FOUND(key))
      return textWhenFailed
    }

    return message
  }

  /** 转换成 Vue 上下文数据 */
  toVueContext() {
    const t = this.t.bind(this)
    return {
      t,
      locale: this,
    }
  }
}
