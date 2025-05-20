import type { IconProps } from '../../icon'
import type { MenuItemProps } from '../../menu'
import type { ToolbarItemProps } from '../../toolbar'

export interface ConfigProviderProps {
  /**
   * 命名空间，会影响到 class 名称，css 变量名称
   * @default 'vmd'
   */
  namespace?: string

  /** icon 组件的默认配置 */
  iconDefault?: IconProps

  /** menu-item 组件的默认配置 */
  menuItemDefault?: MenuItemProps

  /** toolbar-item 组件的默认配置 */
  toolbarItemDefault?: ToolbarItemProps
}

export type DefaultProps = Omit<ConfigProviderProps, 'namespace'>
