# @v-md/core

## 0.0.4

### Patch Changes

- [#9](https://github.com/v-md/v-md/pull/9) [`6b56ce3`](https://github.com/v-md/v-md/commit/6b56ce333618034279d2a5bd28ddc5688de753e3) Thanks [@gkn1234](https://github.com/gkn1234)! - - A new hook `onFileUpload` has been added to the plugin system, allowing you to customize the file upload process.
  ```ts
  export interface Plugin {
    // ...
    onFileUpload?: (
      file: File,
      files: FileManager,
      result: FileOptions
    ) => Promisable<void>;
  }
  ```
  - The plugin `@v-md/plugin-static-assets-basic` has extended the `EditorOptions.assetsUploadAuto` option for the editor core configuration. When this option is set to `true`, the upload method `EditorOptions.assetsUpload` will be automatically called to complete the HTTP upload when a file is uploaded, eliminating the need for manual upload.
  - The plugin `@v-md/plugin-static-assets-basic` has extended the file menu with the option "Download as dataURL". This option is only available after the binary resource file has been uploaded and its URL address has been obtained. Once triggered, the file will be downloaded from the URL and converted to `dataURL` as the file content.
  - The plugin `@v-md/plugin-static-assets-basic` has extended the file menu with the option "Copy URL". Once triggered, you can copy the URL address of the binary resource file.
  - In the image preview component of the `@v-md/plugin-static-assets-basic` plugin, a text field has been added at the bottom to display the resource address of the image.
  - Fixed problem: `EditorOptions` interface in `@v-md/app` package lacks the plugin extension type.

## 0.0.3

### Patch Changes

- [#7](https://github.com/v-md/v-md/pull/7) [`41668f3`](https://github.com/v-md/v-md/commit/41668f3dc06b23a061a7a811c9c14e5926f64ed6) Thanks [@gkn1234](https://github.com/gkn1234)! - The interface for obtaining relevant information based on the file suffix has been changed. Taking a `.css` file as an example, the previous extension method was:

  ```ts
  manager.fileExtToLang.css = "css";
  manager.fileExtToIcon.css = {
    icon: import("./css.svg").then((m) => m.default),
    color: "",
  };
  ```

  The new extension method is:

  ```ts
  files.fileExtMap.css = {
    icon: import("./css.svg").then((m) => m.default),
    iconColor: "",
    lang: "css",
  };
  ```

  For the interface definition of the file suffix associated information, please refer to: [FileExtInfo Interface Definition](/libs/core/src/modules/file/types.ts)

- [#7](https://github.com/v-md/v-md/pull/7) [`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20) Thanks [@gkn1234](https://github.com/gkn1234)! - - Modify the core mechanism of file uploading in `@v-md/core`. When the `MIME` type of the uploaded file is a non-text type, the content will be read via `readAsDataURL` (previously it was `readAsText`) as the body of the file.
  - Implement the plugin `@v-md/plugin-static-assets-basic` to integrate the following functions into the `v-md` editor:
    - Implement the source code compilation method for binary files: When a binary file of the image type is imported via `import`, a string variable will be obtained, and the content of the string is the URL address of the resource.
    - Click on a binary file of the image type with the left mouse button to display the image preview in the editor. (It will no longer be displayed using the default code editor.)
    - Right-click on a binary file and add a new function "Upload Static Resources Remotely" to the menu functions. After clicking, the file can be uploaded to a remote server. After a successful upload, the content of the file will be replaced by the `dataURL` with the uploaded `HTTP URL`. The upload method is custom passed in through `EditorOptions.assetsUpload`. For details, see [Interface Expansion of @v-md/plugin-static-assets-basic](/plugins/static-assets-basic/src/index.ts).
  - The editor preset package `@v-md/app` integrates the plugin `@v-md/plugin-static-assets-basic` by default.
- Updated dependencies [[`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20)]:
  - @v-md/shared@0.0.3
  - @v-md/renderer@0.0.3

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
