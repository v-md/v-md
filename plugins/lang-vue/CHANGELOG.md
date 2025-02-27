# @v-md/plugin-lang-vue

## 0.0.4

### Patch Changes

- 795d302: refactor: editor-highlight 插件改名为 editor-theme 插件，未来也将提供整个编辑器的主题
- Updated dependencies [795d302]
  - @v-md/core@0.0.4

## 0.0.3

### Patch Changes

- bcba47d: fix(playground): 同步更新演练场
  fix(plugin-lang-vue-md): 将 @mdit-vue 系列依赖打包进最终产物，使得用户使用时无需自行处理 node API 兼容问题
  refactor: 微重构，将触发 vue 语言服务的逻辑从各语言插件集中回 volar 插件中
  build: 优化掉 nanoid 依赖，将该模块安装到 @v-md/shared 中
  fix(plugin-lang-vue-md): 优化掉 vue-md 语言支持插件中的 monaco-editor 依赖
  fix(core, plugin-lang-vue-md): 修复 VitePress 的路径代码引用功能无效的问题
  feat(plugin-lang-vue-md): 完善 VitePress 的代码块功能，实装复制效果
  feat(plugin-lang-vue-md): 完善 VitePress 的代码组功能，实装 Tabs 切换的效果
- Updated dependencies [bcba47d]
- Updated dependencies [bcba47d]
  - @v-md/core@0.0.3
  - @v-md/shared@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies [04c60a1]
- Updated dependencies [04c60a1]
  - @v-md/core@0.0.2
  - @v-md/shared@0.0.2

## 0.0.1

### Patch Changes

- 3a87437: fix: 修复 vue/compiler-sfc 循环引用的问题，优先完成异步加载
  refactor: 重构为 monorepo 架构
- Updated dependencies [3a87437]
- Updated dependencies [3a87437]
  - @v-md/core@0.0.1
  - @v-md/shared@0.0.1
