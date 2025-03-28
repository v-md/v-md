# @v-md/app

## 0.0.3

### Patch Changes

- [#7](https://github.com/v-md/v-md/pull/7) [`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20) Thanks [@gkn1234](https://github.com/gkn1234)! - - Modify the core mechanism of file uploading in `@v-md/core`. When the `MIME` type of the uploaded file is a non-text type, the content will be read via `readAsDataURL` (previously it was `readAsText`) as the body of the file.
  - Implement the plugin `@v-md/plugin-static-assets-basic` to integrate the following functions into the `v-md` editor:
    - Implement the source code compilation method for binary files: When a binary file of the image type is imported via `import`, a string variable will be obtained, and the content of the string is the URL address of the resource.
    - Click on a binary file of the image type with the left mouse button to display the image preview in the editor. (It will no longer be displayed using the default code editor.)
    - Right-click on a binary file and add a new function "Upload Static Resources Remotely" to the menu functions. After clicking, the file can be uploaded to a remote server. After a successful upload, the content of the file will be replaced by the `dataURL` with the uploaded `HTTP URL`. The upload method is custom passed in through `EditorOptions.assetsUpload`. For details, see [Interface Expansion of @v-md/plugin-static-assets-basic](/plugins/static-assets-basic/src/index.ts).
  - The editor preset package `@v-md/app` integrates the plugin `@v-md/plugin-static-assets-basic` by default.
- Updated dependencies [[`41668f3`](https://github.com/v-md/v-md/commit/41668f3dc06b23a061a7a811c9c14e5926f64ed6), [`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20)]:
  - @v-md/plugin-lang-json@0.0.3
  - @v-md/plugin-lang-css@0.0.3
  - @v-md/plugin-lang-vue@0.0.3
  - @v-md/plugin-lang-js@0.0.3
  - @v-md/plugin-lang-ts@0.0.3
  - @v-md/plugin-vue-md@0.0.3
  - @v-md/core@0.0.3
  - @v-md/plugin-static-assets-basic@0.0.1
  - @v-md/plugin-editor-theme@0.0.3
  - @v-md/plugin-lang-vue-jsx@0.0.3
  - @v-md/plugin-theme@0.0.3
  - @v-md/plugin-files-basic@0.0.3
  - @v-md/plugin-toolbar-basic@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies [[`2d14f09`](https://github.com/v-md/v-md/commit/2d14f09f14e9d1bd14f4a40e1b11a7beb6e4eca6)]:
  - @v-md/core@0.0.2
  - @v-md/plugin-editor-theme@0.0.2
  - @v-md/plugin-lang-css@0.0.2
  - @v-md/plugin-lang-js@0.0.2
  - @v-md/plugin-lang-json@0.0.2
  - @v-md/plugin-lang-ts@0.0.2
  - @v-md/plugin-lang-vue@0.0.2
  - @v-md/plugin-lang-vue-jsx@0.0.2
  - @v-md/plugin-theme@0.0.2
  - @v-md/plugin-vue-md@0.0.2
  - @v-md/plugin-files-basic@0.0.2
  - @v-md/plugin-toolbar-basic@0.0.2

## 0.0.1

### Patch Changes

- [#4](https://github.com/v-md/v-md/pull/4) [`f15af83`](https://github.com/v-md/v-md/commit/f15af83da041f6eb5eb100c63e6d8de93fd70776) Thanks [@gkn1234](https://github.com/gkn1234)! - reset CHANGELOG

- [#2](https://github.com/v-md/v-md/pull/2) [`716a811`](https://github.com/v-md/v-md/commit/716a8114a4559a475ac2fe24133a5b71f4bcff8f) Thanks [@gkn1234](https://github.com/gkn1234)! - try to publish version first

- Updated dependencies [[`f15af83`](https://github.com/v-md/v-md/commit/f15af83da041f6eb5eb100c63e6d8de93fd70776), [`716a811`](https://github.com/v-md/v-md/commit/716a8114a4559a475ac2fe24133a5b71f4bcff8f)]:
  - @v-md/plugin-toolbar-basic@0.0.1
  - @v-md/plugin-editor-theme@0.0.1
  - @v-md/plugin-lang-vue-jsx@0.0.1
  - @v-md/plugin-files-basic@0.0.1
  - @v-md/plugin-lang-json@0.0.1
  - @v-md/plugin-lang-css@0.0.1
  - @v-md/plugin-lang-vue@0.0.1
  - @v-md/plugin-lang-js@0.0.1
  - @v-md/plugin-lang-ts@0.0.1
  - @v-md/plugin-vue-md@0.0.1
  - @v-md/plugin-theme@0.0.1
  - @v-md/core@0.0.1
