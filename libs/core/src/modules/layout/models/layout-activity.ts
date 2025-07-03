import type { SplitLayoutItemInstance } from '@v-md/ui'
import { computed, ref } from 'vue'
import { EDITOR_MODEL_NAMES } from '../../editor'
import { Model } from '../../model'
import { Slot } from '../../slot'

export class LayoutActivityModel extends Model {
  /** 插槽对象 */
  slots = {
    tab: new Slot(),
  }

  /** 主侧边栏容器引用 */
  sideMainEl = ref<SplitLayoutItemInstance>()

  /** 主侧边栏容器 DOM 元素 */
  sideMainDom = computed(() => this.sideMainEl.value?.$el)

  /** 当前活动项 */
  currentActivity = ref('')

  constructor() {
    super(EDITOR_MODEL_NAMES.LAYOUT_ACTIVITY)
  }

  setup() {

  }
}
