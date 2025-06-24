import { EDITOR_MODEL_NAMES } from '../../editor'
import { Model } from '../../model'
import { Slot } from '../../slot'

export class LayoutBottomModel extends Model {
  /** 插槽对象 */
  slots = {
    left: new Slot(),
    right: new Slot(),
  }

  constructor() {
    super(EDITOR_MODEL_NAMES.LAYOUT_BOTTOM)
  }

  setup() {

  }
}
