# @v-md/plugin-editor-volar

## 0.0.4

### Patch Changes

- Updated dependencies [795d302]
  - @v-md/core@0.0.4

## 0.0.3

### Patch Changes

- bcba47d: refactor: 微重构，将触发 vue 语言服务的逻辑从各语言插件集中回 volar 插件中
  refactor(plugin-editor-volar): vue 语言服务所需的 worker 进程改为通过插件参数传递
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
