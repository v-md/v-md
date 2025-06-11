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

通过 `SplitLayoutItem` 的 `size` 属性设置初始大小。

:::demo
../../demo/other/split-layout/split-layout-sizes.vue
:::

## 多面板分割

支持多个面板的分割布局。

:::demo
../../demo/other/split-layout/split-layout-multiple.vue
:::

## 设置最小大小

通过 `SplitLayoutItem` 的 `min-size` 属性限制面板的最小大小。

:::demo
../../demo/other/split-layout/split-layout-min-size.vue
:::

## 设置最大大小

通过 `SplitLayoutItem` 的 `max-size` 属性限制面板的最大大小。

:::demo
../../demo/other/split-layout/split-layout-max-size.vue
:::

## 禁用调整

通过 `SplitLayoutResizer` 的 `disabled` 属性禁用拖拽调整功能。

:::demo
../../demo/other/split-layout/split-layout-disabled.vue
:::

## 自定义分割线大小

通过 `SplitLayoutResizer` 的 `size` 属性自定义分割线大小。

:::demo
../../demo/other/split-layout/split-layout-resizer-size.vue
:::

## 事件处理

监听分割布局的调整事件。

:::demo
../../demo/other/split-layout/split-layout-events.vue
:::

## 方法调用

使用暴露的方法获取面板大小信息。

:::demo
../../demo/other/split-layout/split-layout-methods.vue
:::

## API

### SplitLayout Props
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | false | 分割方向 |

### SplitLayout Events
| 事件名 | 参数 | 说明 |
|-----|---|---|
| resize | `sizes: string[]` | 大小调整事件，返回所有面板的当前大小 |

### SplitLayout Slots
| 插槽名 | 作用域参数 | 说明 |
|-----|---|---|
| default | - | 默认插槽，放置 SplitLayoutItem 和 SplitLayoutResizer 组件 |

### SplitLayout Expose
| 属性名 | 类型 | 说明 |
|-----|---|---|
| getSizes | `() => string[]` | 获取当前所有面板的大小 |

### SplitLayoutItem Props
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| size | `string \| number \| null` | `null` | false | 面板初始大小<br/>**注意：此属性仅在组件初始化时生效，后续修改不会触发重新计算（非响应性）**<br/>string: 支持 'px'、'%' 单位（如 '200px'、'50%'）<br/>number: 默认单位为 px（如 200 等价于 '200px'）<br/>null: 自动分配，与其他 size 为 null 的面板平分剩余空间 |
| min-size | `string \| number \| null` | `null` | false | 面板最小大小<br/>**注意：此属性仅在组件初始化时生效，后续修改不会触发重新计算（非响应性）**<br/>string: 仅支持 'px'、'%' 单位（如 '100px'、'20%'）<br/>number: 默认单位为 px（如 100 等价于 '100px'）<br/>null: 不限制最小大小 |
| max-size | `string \| number \| null` | `null` | false | 面板最大大小<br/>**注意：此属性仅在组件初始化时生效，后续修改不会触发重新计算（非响应性）**<br/>string: 仅支持 'px'、'%' 单位（如 '500px'、'80%'）<br/>number: 默认单位为 px（如 500 等价于 '500px'）<br/>null: 不限制最大大小 |

### SplitLayoutItem Slots
| 插槽名 | 作用域参数 | 说明 |
|-----|---|---|
| default | - | 默认插槽，面板内容 |

### SplitLayoutItem Expose
| 属性名 | 类型 | 说明 |
|-----|---|---|
| updateSize | `(size: string) => void` | 更新面板大小 |

### SplitLayoutResizer Props
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| disabled | `boolean` | `false` | false | 是否禁用调整<br/>禁用后无法通过拖拽调整两侧面板大小 |
| size | `string \| number` | `'4px'` | false | 分割线大小<br/>string: 仅支持 'px' 单位（如 '4px'）<br/>number: 默认单位为 px（如 4 等价于 '4px'） |

### SplitLayoutResizer Events
| 事件名 | 参数 | 说明 |
|-----|---|---|
| resize-start | - | 拖拽开始事件 |
| resize-end | - | 拖拽结束事件 |

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
| --vmd-split-layout-resizer-cursor-horizontal | `col-resize` | 水平分割线光标 |
| --vmd-split-layout-resizer-cursor-vertical | `row-resize` | 垂直分割线光标 |
| --vmd-split-layout-item-bg-color | `transparent` | 面板背景色 |
| --vmd-split-layout-item-overflow | `hidden` | 面板溢出处理 |
