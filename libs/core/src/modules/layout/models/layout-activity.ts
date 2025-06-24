import { EDITOR_MODEL_NAMES } from '../../editor'
import { Model } from '../../model'
import { Slot } from '../../slot'

export class LayoutActivityModel extends Model {
  /** 插槽对象 */
  slots = {
    tab: new Slot(),
    panel: new Slot(),
  }

  constructor() {
    super(EDITOR_MODEL_NAMES.LAYOUT_ACTIVITY)
  }

  setup() {

  }
}
