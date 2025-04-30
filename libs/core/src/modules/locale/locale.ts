import { Locale as LocaleRaw } from '@v-md/ui'
import { EDITOR_MODEL_NAMES } from '../editor/utils/model-names'
import { Model } from '../model'

export class Locale extends Model {
  locale = new LocaleRaw()

  constructor() {
    super(EDITOR_MODEL_NAMES.LOCALE)
  }
}
