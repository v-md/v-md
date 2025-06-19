# SplitLayout 分割布局

类似 VSCode 的可拖拽分割布局组件，支持水平和垂直分割，可以通过拖拽分割线调整面板大小。

## 基础用法

最基本的分割布局，默认为水平分割。面板使用 `auto-fill` 属性自动平分可用空间。

:::demo
../../demo/other/split-layout/split-layout-basic.vue
:::

## 垂直分割

通过设置 `direction` 为 `vertical` 实现垂直分割。

:::demo
../../demo/other/split-layout/split-layout-vertical.vue
:::

## 自定义初始大小

通过 `SplitLayoutItem` 的 `size` 属性设置初始大小，支持像素值、百分比等。

:::demo
../../demo/other/split-layout/split-layout-sizes.vue
:::

## auto-fill 和 auto-adjust 属性

`auto-fill` 属性用于自动填充剩余空间，`auto-adjust` 属性用于控制容器大小变化时的自动调整行为。

:::demo
../../demo/other/split-layout/split-layout-auto-properties.vue
:::

## 多面板分割

支持多个面板的分割布局，每个面板之间需要放置 `SplitLayoutResizer` 分割线。

:::demo
../../demo/other/split-layout/split-layout-multiple.vue
:::

## 设置最小大小

通过 `SplitLayoutItem` 的 `min-size` 属性限制面板的最小大小，防止面板被拖拽得过小。

:::demo
../../demo/other/split-layout/split-layout-min-size.vue
:::

## 设置最大大小

通过 `SplitLayoutItem` 的 `max-size` 属性限制面板的最大大小，防止面板被拖拽得过大。

:::demo
../../demo/other/split-layout/split-layout-max-size.vue
:::

## 级联拖拽效果

当面板因 `min-size` 或 `max-size` 限制无法继续调整时，拖拽操作会产生级联效应，自动调整其他面板的大小以满足所有限制条件。

:::demo
../../demo/other/split-layout/split-layout-cascade.vue
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

监听分割布局的调整事件，可以获取拖拽状态和大小变化信息。

:::demo
../../demo/other/split-layout/split-layout-events.vue
:::

## 方法调用

使用暴露的方法获取和更新面板大小信息。

:::demo
../../demo/other/split-layout/split-layout-methods.vue
:::

## 编程式移动分割线

使用 `SplitLayoutResizer` 的 `move` 方法可以编程式地移动分割线，实现精确的布局控制。

:::demo
../../demo/other/split-layout/split-layout-move-method.vue
:::

## API

### SplitLayout Props
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | false | 分割方向 |

### SplitLayout Events
| 事件名 | 参数 | 说明 |
|-----|---|---|
| resize | `sizes: number[]` | 大小调整事件，返回所有面板的当前大小（像素值） |

### SplitLayout Slots
| 插槽名 | 作用域参数 | 说明 |
|-----|---|---|
| default | - | 默认插槽，放置 SplitLayoutItem 和 SplitLayoutResizer 组件 |

### SplitLayout Expose
| 属性名 | 类型 | 说明 |
|-----|---|---|
| getSizes | `() => number[]` | 获取当前所有面板的大小（像素值） |

### SplitLayoutItem Props
| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|-----|---|-----|----|---|
| size | `string \| number \| null` | `null` | false | 面板初始大小<br/>**注意：此属性仅在组件初始化时生效，后续修改不会触发重新计算（非响应性）**<br/>string: 支持 'px'、'%' 单位（如 '200px'、'50%'）<br/>number: 默认单位为 px（如 200 等价于 '200px'）<br/>null: 自动分配 |
| min-size | `string \| number \| null` | `null` | false | 面板最小大小<br/>**注意：此属性仅在组件初始化时生效，后续修改不会触发重新计算（非响应性）**<br/>string: 仅支持 'px'、'%' 单位（如 '100px'、'20%'）<br/>number: 默认单位为 px（如 100 等价于 '100px'）<br/>null: 不限制最小大小 |
| max-size | `string \| number \| null` | `null` | false | 面板最大大小<br/>**注意：此属性仅在组件初始化时生效，后续修改不会触发重新计算（非响应性）**<br/>string: 仅支持 'px'、'%' 单位（如 '500px'、'80%'）<br/>number: 默认单位为 px（如 500 等价于 '500px'）<br/>null: 不限制最大大小 |
| auto-fill | `boolean` | `false` | false | 容器内元素增减时是否与其他同类型面板平分剩余空间<br/>会受到 `min-size` 和 `max-size` 限制 |
| auto-adjust | `boolean` | `true` | false | 容器大小变动时是否自动调整大小<br/>会受到 `min-size` 和 `max-size` 限制 |

### SplitLayoutItem Slots
| 插槽名 | 作用域参数 | 说明 |
|-----|---|---|
| default | - | 默认插槽，面板内容 |

### SplitLayoutItem Expose
| 属性名 | 类型 | 说明 |
|-----|---|---|
| updateSize | `(size: number \| string) => number` | 更新面板大小<br/>会受到 `min-size` 和 `max-size` 限制<br/>返回实际的尺寸变动 |

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

### SplitLayoutResizer Expose
| 属性名 | 类型 | 说明 |
|-----|---|---|
| move | `(offset: number) => void` | 编程式移动分割线<br/>offset: 偏移量（单位 px），向右/下为正，向左/上为负<br/>会受到面板约束条件的影响，可能产生级联调整效果 |

### SplitLayout CSS 变量
| 变量名 | 默认值 | 说明 |
|-----|-----|---|
| --vmd-split-layout-resizer-bg-color | `var(--vmd-color-border-light)` | 分割线背景色 |
| --vmd-split-layout-resizer-bg-color-hover | `var(--vmd-color-border-dark)` | 分割线悬停背景色 |
| --vmd-split-layout-resizer-bg-color-active | `var(--vmd-color-border-dark)` | 分割线激活背景色 |
