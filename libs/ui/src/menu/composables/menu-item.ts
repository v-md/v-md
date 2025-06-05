import type {
  Ref,
} from 'vue'
import type { TippyComponent } from '../../tippy'
import type { MenuItemProps } from '../types'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useElementHover } from '../../common'
import { MenuContext } from './menu'

interface MenuItemElement extends HTMLElement {
  _menuItemContext: MenuItemContext
}

/** Dom 元素的标记，必须与模板中绑定的 dataset 属性相对应 */
const DATASET_KEY = 'vmdMenuItem'

export class MenuItemContext {
  menu: MenuContext

  props: MenuItemProps

  /** 子组件在组件列表中的索引 */
  index = -1

  /** 子组件主元素引用 */
  itemEl = ref<MenuItemElement>()

  /** 子组件点击触发元素引用 */
  linkEl = ref<HTMLAnchorElement>()

  /** 子菜单引用 */
  tippyEl = ref<TippyComponent>()

  /** 鼠标是否覆盖子组件 */
  isHovered: Ref<boolean>

  /** 折叠子菜单是否可用 */
  collapseEnabled = computed(() =>
    !this.props.split &&
    this.props.collapseTrigger &&
    this.props.collapseTrigger !== 'none',
  )

  constructor(props: MenuItemProps) {
    this.props = props
    this.menu = MenuContext.use()

    onMounted(() => {
      this.mount()
    })

    onBeforeUnmount(() => {
      this.unmount()
    })

    const elementHover = useElementHover(this.linkEl)
    this.isHovered = elementHover.isHovered
  }

  mount() {
    const el = this.itemEl.value
    if (!el) {
      return
    }

    el._menuItemContext = this
    const prevItem = this.findPrevItem()
    const index = prevItem ? prevItem._menuItemContext.index + 1 : 0
    this.menu.children.splice(index, 0, this)
    this.index = index

    for (let i = index + 1; i < this.menu.children.length; i++) {
      this.menu.children[i].index = i
    }
  }

  unmount() {
    this.menu.children.splice(this.index, 1)

    for (let i = this.index; i < this.menu.children.length; i++) {
      this.menu.children[i].index = i
    }
  }

  findPrevItem() {
    if (!this.itemEl.value) {
      return null
    }

    let cur = this.itemEl.value.previousSibling
    while (cur) {
      if ((cur as any)?.dataset?.[DATASET_KEY]) {
        return cur as MenuItemElement
      }
      cur = cur.previousSibling
    }
    return null
  }

  private _setupHover() {
    const { isHovered } = useElementHover(this.linkEl)
    watch(isHovered, (val) => {

    })
  }
}
