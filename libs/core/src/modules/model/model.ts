import type { Editor } from '../editor/model/editor'
import { EDITOR_ERR_MSG } from '../editor/utils/err-msg'

export class Model {
  private _editor?: Editor

  /** 编辑器实例 */
  get editor() {
    if (!this._editor) {
      throw new Error(EDITOR_ERR_MSG.NOT_READY)
    }
    return this._editor
  }

  /** 数据名称，用于在编辑器索引对应的数据 */
  modelName: string

  /**
   * 编辑器基础数据模块
   * @param name 数据名称
   */
  constructor(name: string) {
    this.modelName = name
  }

  bind(editor: Editor) {
    this._editor = editor
  }

  unbind() {
    delete this._editor
  }
}
