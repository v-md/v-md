import { EDITOR_MODEL_NAMES } from '../../editor/utils/model-names'
import { Model } from '../../model'
import { Slot } from '../../slot'

export class LayoutTop extends Model {
  /** 插槽对象 */
  slots = {
    left: new Slot(),
    center: new Slot(),
    right: new Slot(),
  }

  constructor() {
    super(EDITOR_MODEL_NAMES.LAYOUT_TOP)
  }

  setup() {

  }
}
