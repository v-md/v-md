# @v-md/playground

## 0.0.5

### Patch Changes

- [#11](https://github.com/v-md/v-md/pull/11) [`3bcf9aa`](https://github.com/v-md/v-md/commit/3bcf9aad74632ee34e0b18a9e520c24ab8ea1d4c) Thanks [@gkn1234](https://github.com/gkn1234)! - Playground integrates the `@v-md/plugin-lang-sass` plugin and supports `sass`.

- Updated dependencies [[`3bcf9aa`](https://github.com/v-md/v-md/commit/3bcf9aad74632ee34e0b18a9e520c24ab8ea1d4c)]:
  - @v-md/plugin-lang-sass@0.0.1
  - @v-md/app@0.0.5
  - @v-md/plugin-editor-volar@0.0.5

## 0.0.4

### Patch Changes

- Updated dependencies [[`6b56ce3`](https://github.com/v-md/v-md/commit/6b56ce333618034279d2a5bd28ddc5688de753e3)]:
  - @v-md/app@0.0.4
  - @v-md/plugin-editor-volar@0.0.4

## 0.0.3

### Patch Changes

- [#7](https://github.com/v-md/v-md/pull/7) [`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20) Thanks [@gkn1234](https://github.com/gkn1234)! - - Modify the core mechanism of file uploading in `@v-md/core`. When the `MIME` type of the uploaded file is a non-text type, the content will be read via `readAsDataURL` (previously it was `readAsText`) as the body of the file.
  - Implement the plugin `@v-md/plugin-static-assets-basic` to integrate the following functions into the `v-md` editor:
    - Implement the source code compilation method for binary files: When a binary file of the image type is imported via `import`, a string variable will be obtained, and the content of the string is the URL address of the resource.
    - Click on a binary file of the image type with the left mouse button to display the image preview in the editor. (It will no longer be displayed using the default code editor.)
    - Right-click on a binary file and add a new function "Upload Static Resources Remotely" to the menu functions. After clicking, the file can be uploaded to a remote server. After a successful upload, the content of the file will be replaced by the `dataURL` with the uploaded `HTTP URL`. The upload method is custom passed in through `EditorOptions.assetsUpload`. For details, see [Interface Expansion of @v-md/plugin-static-assets-basic](/plugins/static-assets-basic/src/index.ts).
  - The editor preset package `@v-md/app` integrates the plugin `@v-md/plugin-static-assets-basic` by default.
- Updated dependencies [[`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20), [`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20)]:
  - @v-md/shared@0.0.3
  - @v-md/app@0.0.3
  - @v-md/plugin-editor-volar@0.0.3

## 0.0.2

### Patch Changes

- [#5](https://github.com/v-md/v-md/pull/5) [`0db5e8a`](https://github.com/v-md/v-md/commit/0db5e8a4a65cc209c5363a33037f4c237b8872f9) Thanks [@gkn1234](https://github.com/gkn1234)! - Change the preview address of the `playground` from `/v-md/view` to `/v-md/?view=true`. This ensures that the preview URL will not return a 404 error in the `Github Pages` scenario.

- Updated dependencies [[`2d14f09`](https://github.com/v-md/v-md/commit/2d14f09f14e9d1bd14f4a40e1b11a7beb6e4eca6)]:
  - @v-md/shared@0.0.2
  - @v-md/plugin-editor-volar@0.0.2
  - @v-md/app@0.0.2

## 0.0.1

### Patch Changes

- [#4](https://github.com/v-md/v-md/pull/4) [`f15af83`](https://github.com/v-md/v-md/commit/f15af83da041f6eb5eb100c63e6d8de93fd70776) Thanks [@gkn1234](https://github.com/gkn1234)! - reset CHANGELOG

- [#2](https://github.com/v-md/v-md/pull/2) [`716a811`](https://github.com/v-md/v-md/commit/716a8114a4559a475ac2fe24133a5b71f4bcff8f) Thanks [@gkn1234](https://github.com/gkn1234)! - try to publish version first

- Updated dependencies [[`f15af83`](https://github.com/v-md/v-md/commit/f15af83da041f6eb5eb100c63e6d8de93fd70776), [`716a811`](https://github.com/v-md/v-md/commit/716a8114a4559a475ac2fe24133a5b71f4bcff8f)]:
  - @v-md/plugin-editor-volar@0.0.1
  - @v-md/app@0.0.1
