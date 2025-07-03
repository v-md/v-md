# Tab 标签页

用于在多个内容面板之间进行切换的标签页组件，支持垂直和水平布局，可配置间隙和折叠功能。
````
## 基础用法

最基本的标签页用法，展示水平布局的标签页。

:::demo
../../demo/navigation/tab/tab-basic.vue
:::

## 垂直布局

设置 `direction="vertical"` 可以使标签页垂直排列。

:::demo
../../demo/navigation/tab/tab-vertical.vue
:::

## 设置间隙

通过 `gap` 属性可以设置标签页之间的间隙。

:::demo
../../demo/navigation/tab/tab-gap.vue
:::

## 禁用状态

通过设置 `TabItem` 的 `disabled` 属性可以禁用某个标签页。

:::demo
../../demo/navigation/tab/tab-disabled.vue
:::

## 面板展示

通过设置 `panelTeleportTo` 属性可以指定面板内容的渲染位置。

:::demo
../../demo/navigation/tab/tab-panel.vue
:::
````

## 折叠功能

当宽度不足时，超出的标签页会自动折叠到下拉菜单中。可以通过 `disableCollapse` 禁用此功能。

:::demo
../../demo/navigation/tab/tab-collapse.vue
:::

## API

### Tab Props
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| direction | `'vertical' \| 'horizontal'` | `'horizontal'` | false | 布局方向 |
| gap | `string \| number` | `0` | false | 布局间隙<br/>string: 支持 CSS 单位，但仅限 px 单位，如 '4px'<br/>number: 数字类型，默认单位为 px，如 4 等价于 '4px' |
| disableCollapse | `boolean` | `false` | false | 宽度不足时，禁止折叠 |
| panelTeleportTo | `TeleportProps['to']` | `null` | false | panel 面板的 Teleport 目标，如果为空，则 panel 插槽不可用，子面板不展示 |

### Tab Model
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| modelValue | `any` | `''` | false | 当前激活的 tab-item 子项的值 |

### Tab Slots
| 插槽名 | 作用域参数 | 说明 |
|-----|---|---|
| default | - | 默认插槽，用于放置 TabItem 组件 |
| collapse | - | 折叠按钮插槽，自定义折叠按钮的显示内容 |

### TabItem Props
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| value | `any` | `''` | false | 唯一标识，激活时会触发父组件 tab `modelValue` 的更新 |
| disabled | `boolean` | `false` | false | 是否禁用 |
| disableSelect | `boolean` | `false` | false | 是否禁用选中。禁用时，无法被选中，用户需要自定义点击触发事件 |

### TabItem Slots
| 插槽名 | 作用域参数 | 说明 |
|-----|---|---|
| default | - | 默认插槽，用于显示标签页内容 |
| collapse | - | 折叠菜单插槽，当标签页被折叠时显示的内容 |
| panel | - | 面板插槽，用于显示对应的面板内容 |

### Tab CSS 变量
| 变量名 | 默认值 | 说明 |
|-----|-----|---|
| --vmd-tab-color | `var(--vmd-color-text-secondary)` | 标签页文字颜色 |
| --vmd-tab-color-hover | `var(--vmd-color-text-primary)` | 标签页悬停时文字颜色 |
| --vmd-tab-color-active | `var(--vmd-color-text-primary)` | 标签页激活时文字颜色 |
| --vmd-tab-color-disabled | `var(--vmd-color-text-secondary)` | 标签页禁用时文字颜色 |
| --vmd-tab-bg-color | `transparent` | 标签页背景颜色 |
| --vmd-tab-bg-color-hover | `transparent` | 标签页悬停时背景颜色 |
| --vmd-tab-bg-color-active | `transparent` | 标签页激活时背景颜色 |
| --vmd-tab-bg-color-disabled | `transparent` | 标签页禁用时背景颜色 |
