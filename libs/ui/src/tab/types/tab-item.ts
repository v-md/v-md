import type { InferVueDefaults } from '../../common'

export interface TabItemProps {
  /**
   * 唯一标识，激活时会触发父组件 Tab `modelValue` 的更新
   * @default ''
   */
  value?: any

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 是否禁用选中。禁用时，无法被选中，用户需要自定义点击触发事件
   * @default false
   */
  disableSelect?: boolean
}

export function defaultTabItemProps() {
  return {
    value: '',
    disabled: false,
    disableSelect: false,
  } satisfies InferVueDefaults<TabItemProps>
}

export interface TabItemSlots {
  /** 默认插槽，非折叠状态下的选项 */
  default: () => any

  /** 折叠状态下的选项 */
  collapse: (props: {
    /** 选项触发函数，与非折叠状态下的点击触发函数一致 */
    trigger: () => void
  }) => any

  /** 选项关联的面板 */
  panel: () => any
}
