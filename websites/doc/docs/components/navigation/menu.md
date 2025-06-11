# Menu 菜单

菜单组件用于展示一组操作选项，支持嵌套子菜单、图标显示、快捷键提示等功能，常用于上下文菜单、下拉菜单等场景。

## 基础用法

展示基本的菜单结构，包含图标、文字标签、快捷键提示和分隔线。

:::demo
../../demo/menu/menu-basic.vue
:::

## 嵌套子菜单

支持多层嵌套的子菜单，子菜单可以通过悬停或点击触发显示。

:::demo
../../demo/menu/menu-sub.vue
:::

## 触发方式

子菜单支持不同的触发方式：悬停触发、点击触发或禁用触发。

:::demo
../../demo/menu/menu-trigger.vue
:::

## 图标和快捷键

菜单项可以显示图标和快捷键提示，提供更丰富的视觉和交互体验。

:::demo
../../demo/menu/menu-icons.vue
:::

## 禁用状态

菜单项可以设置为禁用状态，禁用后不响应用户交互。

:::demo
../../demo/menu/menu-disabled.vue
:::

## 延时配置

可以配置子菜单的触发延时，适应不同的交互需求。

:::demo
../../demo/menu/menu-delay.vue
:::

## API

### Menu Props
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| collapseDelay | `number` | `300` | `false` | 浮动窗触发延时，单位：毫秒 |

### MenuItem Props
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| split | `boolean` | `false` | `false` | 渲染分隔线，为 true 时其他选项均无效 |
| icon | `IconPropsWithAttrs \| null` | `null` | `false` | 菜单项最左侧小图标选项<br/>为空代表不展示小图标 |
| label | `string` | `''` | `false` | 菜单项左侧主文字内容 |
| keyBinding | `string` | `''` | `false` | 菜单项右侧快捷键文字内容<br/>并不会真正绑定快捷键事件，只决定展示的文字内容 |
| collapseIcon | `IconPropsWithAttrs \| boolean` | `false` | `false` | 菜单项右侧的折叠箭头<br/>object: 显示折叠箭头，对象将作为 Icon 组件的属性传入<br/>true: 展示默认的折叠箭头<br/>false: 不展示折叠箭头 |
| collapseTrigger | `'hover' \| 'click' \| 'none'` | `'none'` | `false` | 折叠浮动窗的触发方式<br/>'none': 禁用折叠浮动窗<br/>'hover': 鼠标悬停时触发<br/>'click': 点击后触发 |
| disabled | `boolean` | `false` | `false` | 是否禁用 |
| hidden | `boolean` | `false` | `false` | 是否隐藏 |

### MenuItem Slots
| 插槽名 | 作用域参数 | 说明 |
|-----|---|---|
| default | - | 弹出浮动窗中的内容 |

### Menu CSS 变量
| 变量名 | 默认值 | 说明 |
|-----|-----|---|
| --vmd-menu-bg-color | --vmd-color-bg-content | 菜单背景色 |
| --vmd-menu-bg-color-active | --vmd-color-hover | 菜单项悬停背景色 |
| --vmd-menu-border-color | --vmd-color-border | 菜单边框色 |
| --vmd-menu-border-radius | 4px | 菜单边框圆角 |
| --vmd-menu-icon-size | 16px | 菜单图标大小 |
| --vmd-menu-icon-color | --vmd-color-text-primary | 菜单图标颜色 |
| --vmd-menu-label-size | --vmd-font-size-small | 菜单标签字体大小 |
| --vmd-menu-label-color | --vmd-color-text-primary | 菜单标签文字颜色 |
| --vmd-menu-key-binding-size | --vmd-font-size-small | 快捷键文字大小 |
| --vmd-menu-key-binding-color | --vmd-color-text-primary | 快捷键文字颜色 |
| --vmd-menu-padding | 4px 0 | 菜单内边距 |
| --vmd-menu-item-padding | 2px 28px | 菜单项内边距 |
| --vmd-menu-split-margin | 4px 0 | 分隔线外边距 |
