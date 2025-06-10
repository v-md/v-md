# SplitLayout 分割布局

类似 VSCode 的可拖拽分割布局组件，支持水平和垂直分割，可以通过拖拽分割线调整面板大小。

## 基础用法

最基本的分割布局，默认为水平分割。

:::demo
../../demo/other/split-layout/split-layout-basic.vue
:::

## 垂直分割

通过设置 `direction` 为 `vertical` 实现垂直分割。

:::demo
../../demo/other/split-layout/split-layout-vertical.vue
:::

## 自定义初始大小

通过 `sizes` 属性设置初始大小比例。

:::demo
../../demo/other/split-layout/split-layout-sizes.vue
:::

## 多面板分割

支持多个面板的分割布局。

:::demo
../../demo/other/split-layout/split-layout-multiple.vue
:::

## 设置最小大小

通过 `min-size` 属性限制面板的最小大小。

:::demo
../../demo/other/split-layout/split-layout-min-size.vue
:::

## 禁用调整

通过 `disabled` 属性禁用拖拽调整功能。

:::demo
../../demo/other/split-layout/split-layout-disabled.vue
:::

## API

### SplitLayout Props
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | false | 分割方向 |
| sizes | `number[] \| number` | `50` | false | 初始大小比例，可以是数组表示每个面板的大小，或数字表示第一个面板的大小百分比 |
| resizer-size | `number` | `4` | false | 分割线宽度 |
| min-size | `number \| number[]` | `50` | false | 面板最小大小 |
| max-size | `number \| number[]` | - | false | 面板最大大小 |
| disabled | `boolean` | `false` | false | 是否禁用调整大小 |
| allow-reset | `boolean` | `true` | false | 是否允许双击重置为默认大小 |

### SplitLayout Events
| 事件名 | 参数 | 说明 |
|-----|---|---|
| resize | `sizes: number[]` | 大小调整事件 |
| resize-start | `index: number` | 拖拽开始事件 |
| resize-end | `index: number` | 拖拽结束事件 |

### SplitLayout Slots
| 插槽名 | 作用域参数 | 说明 |
|-----|---|---|
| default | - | 默认插槽，放置面板内容 |

### SplitLayout Expose
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| reset | `() => void` | - | - | 重置为默认大小 |
| getSizes | `() => number[]` | - | - | 获取当前大小 |
| setSizes | `(sizes: number[]) => void` | - | - | 设置大小 |

### SplitLayout CSS 变量
| 变量名 | 默认值 | 说明 |
|-----|-----|---|
| --vmd-split-layout-bg-color | `var(--vmd-color-bg-content)` | 容器背景色 |
| --vmd-split-layout-border-color | `var(--vmd-color-border)` | 边框颜色 |
| --vmd-split-layout-border-radius | `0` | 边框圆角 |
| --vmd-split-layout-resizer-bg-color | `transparent` | 分割线背景色 |
| --vmd-split-layout-resizer-bg-color-hover | `var(--vmd-color-hover)` | 分割线悬停背景色 |
| --vmd-split-layout-resizer-bg-color-active | `var(--vmd-color-active)` | 分割线激活背景色 |
| --vmd-split-layout-resizer-size | `4px` | 分割线大小 |
| --vmd-split-layout-resizer-transition | `background-color 0.2s` | 分割线过渡效果 |
| --vmd-split-layout-panel-min-size | `50px` | 面板最小大小 |
