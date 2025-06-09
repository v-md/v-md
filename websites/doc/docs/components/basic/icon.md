# Icon 图标

图标组件，支持 SVG 和图片两种类型的图标。SVG 图标支持颜色继承和动态修改，图片图标则保持原始样式。

## 基础用法

SVG 图标支持通过 CSS 继承颜色，可以通过修改父元素的 `color` 属性来改变图标颜色。适用于需要动态改变颜色的场景。

:::demo
../../demo/basic/icon/icon-basic.vue
:::

## 尺寸定制

可以通过 CSS 变量 `--vmd-icon-size` 来自定义图标尺寸。

:::demo
../../demo/basic/icon/icon-size.vue
:::

## 异步加载

图标支持异步加载，可以传入 Promise、异步函数或动态导入函数。适用于需要延迟加载图标资源的场景。点击"开始异步加载"按钮可以触发加载，观察不同延迟时间的加载效果。

:::demo
../../demo/basic/icon/icon-async.vue
:::

## 图片图标

图片图标支持 PNG、JPG 等常见图片格式，不支持颜色修改，适用于需要保持原始样式的场景。

:::demo
../../demo/basic/icon/icon-img.vue
:::

## API

### Icon Props

| 属性名 | 类型 | 默认值 | 是否必填 | 说明 |
|--------|------|--------|----------|------|
| url | `DynamicImportResolver<string>` | - | 否 | 图标 url，为空代表不展示小图标，支持异步加载 |
| type | `'svg' \| 'img'` | `'svg'` | 否 | 图标的类型：svg 格式的图标支持换色，img 图片图标不支持换色 |

### Icon CSS 变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| --vmd-icon-size | 16px | 图标尺寸 |
