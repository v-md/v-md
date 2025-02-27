# @v-md/core

## 0.0.4

### Patch Changes

- 795d302: feat(plugin-theme): 添加 VitePress 主题

## 0.0.3

### Patch Changes

- bcba47d: feat(core): 重新渲染时，预览 iframe 记忆先前的滚动状态
  fix(core, plugin-lang-vue-md): 修复 VitePress 的路径代码引用功能无效的问题
  fix(core): 解决编辑模式下，给全局变量绑定事件，在更新渲染时因触发器未清理而重复触发的问题
- Updated dependencies [bcba47d]
  - @v-md/shared@0.0.3
  - @v-md/renderer@0.0.3

## 0.0.2

### Patch Changes

- 04c60a1: feat(core): 支持 Ctrl + 鼠标左键点击变量跳转到定义文件。#9
  feat(core,renderer): 实现 blobUrl 的引入机制，并解决了性能问题
  feat(core): 文件与 monaco model 一一对应，确保 TS 能够定位到模块。#8
  fix(core): 修复左侧文件导航删除、重命名功能的问题。#10
- Updated dependencies [04c60a1]
- Updated dependencies [04c60a1]
  - @v-md/renderer@0.0.2
  - @v-md/shared@0.0.2

## 0.0.1

### Patch Changes

- 3a87437: fix: 修复 vue/compiler-sfc 循环引用的问题，优先完成异步加载
  refactor: 重构为 monorepo 架构
- Updated dependencies [3a87437]
- Updated dependencies [3a87437]
  - @v-md/renderer@0.0.1
  - @v-md/shared@0.0.1
