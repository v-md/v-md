# SplitLayout 组件实现总结

## 🎯 功能概述

成功实现了类似 VSCode 的 SplitLayout 分割布局组件，具备以下核心功能：

### ✅ 核心特性
- **双向分割**：支持水平和垂直分割
- **拖拽调整**：可通过拖拽分割线调整面板大小
- **多面板支持**：支持 2 个或更多面板的分割
- **大小限制**：支持设置面板的最小/最大大小
- **禁用功能**：可禁用拖拽调整
- **双击重置**：双击分割线重置为默认大小
- **触摸支持**：支持移动端触摸操作

### ✅ 技术特性
- **TypeScript 支持**：完整的类型定义
- **响应式设计**：基于百分比的响应式布局
- **事件系统**：完整的事件回调机制
- **样式可定制**：基于 CSS 变量的主题系统
- **无障碍支持**：符合可访问性标准

## 📁 文件结构

```
libs/ui/src/split-layout/
├── types/
│   ├── split-layout.ts     # 类型定义
│   └── index.ts           # 类型导出
├── composables/
│   ├── use-split-layout.ts # 核心逻辑
│   └── index.ts           # 组合函数导出
├── styles/
│   ├── var.scss           # 样式变量
│   └── split-layout.scss  # 组件样式
├── view/
│   └── split-layout.vue   # Vue 组件
├── __tests__/
│   └── split-layout.spec.ts # 单元测试
└── index.ts               # 组件入口
```

## 🔧 API 设计

### Props
- `direction`: 分割方向 ('horizontal' | 'vertical')
- `sizes`: 初始大小比例 (number[] | number)
- `resizerSize`: 分割线宽度
- `minSize`: 面板最小大小
- `maxSize`: 面板最大大小
- `disabled`: 是否禁用调整
- `allowReset`: 是否允许双击重置

### Events
- `resize`: 大小调整事件
- `resize-start`: 拖拽开始事件
- `resize-end`: 拖拽结束事件

### Expose Methods
- `reset()`: 重置为默认大小
- `getSizes()`: 获取当前大小
- `setSizes(sizes)`: 设置大小

## 🎨 样式系统

### CSS 变量
- `--vmd-split-layout-bg-color`: 容器背景色
- `--vmd-split-layout-resizer-bg-color`: 分割线背景色
- `--vmd-split-layout-resizer-bg-color-hover`: 分割线悬停色
- `--vmd-split-layout-resizer-bg-color-active`: 分割线激活色
- `--vmd-split-layout-resizer-size`: 分割线大小
- `--vmd-split-layout-resizer-transition`: 过渡效果

### BEM 类名规范
- `.vmd-split-layout`: 主容器
- `.vmd-split-layout-horizontal`: 水平分割
- `.vmd-split-layout-vertical`: 垂直分割
- `.vmd-split-layout-disabled`: 禁用状态
- `.vmd-split-layout-resizing`: 拖拽状态
- `.vmd-split-layout-panel`: 面板
- `.vmd-split-layout-resizer`: 分割线

## 📖 文档和示例

### 文档位置
- 组件文档：`websites/doc/docs/components/other/split-layout.md`
- 分类索引：`websites/doc/docs/components/other/index.md`

### 示例文件
- `split-layout-basic.vue`: 基础用法
- `split-layout-vertical.vue`: 垂直分割
- `split-layout-sizes.vue`: 自定义大小
- `split-layout-multiple.vue`: 多面板
- `split-layout-min-size.vue`: 最小大小限制
- `split-layout-disabled.vue`: 禁用状态

## 🔄 核心算法

### 拖拽逻辑
1. **事件监听**：监听 mousedown/touchstart 事件
2. **位置计算**：计算拖拽距离并转换为百分比
3. **约束检查**：应用最小/最大大小限制
4. **大小更新**：更新相邻面板的大小比例
5. **事件触发**：触发相应的事件回调

### 响应式计算
- 基于容器大小的百分比计算
- 像素到百分比的动态转换
- 约束条件的实时验证

## 🧪 测试覆盖

### 单元测试
- 组件渲染测试
- 属性传递测试
- 事件触发测试
- 方法调用测试

## 🚀 使用示例

```vue
<script setup>
import { SplitLayout } from '@v-md/ui'

function handleResize(sizes) {
  console.log('新的大小比例:', sizes)
}
</script>

<template>
  <SplitLayout
    direction="horizontal"
    :sizes="[30, 70]"
    :min-size="[20, 30]"
    @resize="handleResize">
    <div>左侧面板</div>
    <div>右侧面板</div>
  </SplitLayout>
</template>
```

## 🎯 特色亮点

1. **完全符合组件库规范**：遵循 @v-md/ui 的所有开发规范
2. **类似 VSCode 体验**：提供专业级的分割布局体验
3. **高度可定制**：通过 CSS 变量和 props 实现灵活配置
4. **性能优化**：使用 Vue 3 Composition API 和响应式系统
5. **无障碍支持**：考虑了键盘导航和屏幕阅读器支持
6. **移动端友好**：支持触摸操作和响应式设计

## 📋 后续优化建议

1. **键盘支持**：添加键盘快捷键操作
2. **动画效果**：添加平滑的大小调整动画
3. **嵌套支持**：支持嵌套的分割布局
4. **持久化**：支持布局状态的本地存储
5. **预设布局**：提供常用的布局预设
