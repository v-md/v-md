# @v-md/core

## 0.0.2

### Patch Changes

- [#5](https://github.com/v-md/v-md/pull/5) [`2d14f09`](https://github.com/v-md/v-md/commit/2d14f09f14e9d1bd14f4a40e1b11a7beb6e4eca6) Thanks [@gkn1234](https://github.com/gkn1234)! - - **File Management Improvements**: Enhanced file management capabilities in the left-side file navigator, including `New File`, `Upload File`, `New Directory`, `Cut`, `Copy`, `Paste`, `Rename`, and `Delete` operations.

  - **Keyboard Shortcuts**: Implemented standard keyboard shortcuts for common file operations (`Cut`, `Copy`, `Paste`, `Rename`, `Delete`) following industry conventions.
  - **Customization Support**: The file management system is fully customizable. Developers can extend functionality via plugins using the `onFilesInit` hook. Example implementation:

  ```ts
  import type { Plugin } from "@v-md/core";

  const plugin: Plugin = {
    name: "custom-file-operations-menu",
    onFilesInit(files) {
      const { view } = files.manager;

      // Add custom menu items
      view.menuItems.push(/* custom items */);

      // Alternatively use dedicated methods
      view.addMenuItem({
        // configuration object
      });

      // Remove default menu items
      view.deleteMenuItem(/* identifier */);
    },
  };
  ```

  - **API References**:
    - [Menu Item Management API](/libs/core/src/modules/file/manager-view.ts)
    - [MenuItem Type Definitions](/libs/core/src/modules/file/file-view.types.ts)

- Updated dependencies [[`2d14f09`](https://github.com/v-md/v-md/commit/2d14f09f14e9d1bd14f4a40e1b11a7beb6e4eca6)]:
  - @v-md/shared@0.0.2
  - @v-md/renderer@0.0.2

## 0.0.1

### Patch Changes

- [#4](https://github.com/v-md/v-md/pull/4) [`f15af83`](https://github.com/v-md/v-md/commit/f15af83da041f6eb5eb100c63e6d8de93fd70776) Thanks [@gkn1234](https://github.com/gkn1234)! - reset CHANGELOG

- [#2](https://github.com/v-md/v-md/pull/2) [`716a811`](https://github.com/v-md/v-md/commit/716a8114a4559a475ac2fe24133a5b71f4bcff8f) Thanks [@gkn1234](https://github.com/gkn1234)! - try to publish version first

- Updated dependencies [[`f15af83`](https://github.com/v-md/v-md/commit/f15af83da041f6eb5eb100c63e6d8de93fd70776), [`716a811`](https://github.com/v-md/v-md/commit/716a8114a4559a475ac2fe24133a5b71f4bcff8f)]:
  - @v-md/renderer@0.0.1
  - @v-md/shared@0.0.1
