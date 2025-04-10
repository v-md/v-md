# @v-md/plugin-static-assets-basic

## 0.0.4

### Patch Changes

- Updated dependencies [[`eb7141e`](https://github.com/v-md/v-md/commit/eb7141ebdcde87cbbf1473fb9769a6cd9225bafc)]:
  - @v-md/shared@0.0.4
  - @v-md/core@0.0.6

## 0.0.3

### Patch Changes

- Updated dependencies [[`3bcf9aa`](https://github.com/v-md/v-md/commit/3bcf9aad74632ee34e0b18a9e520c24ab8ea1d4c)]:
  - @v-md/core@0.0.5

## 0.0.2

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
- Updated dependencies [[`6b56ce3`](https://github.com/v-md/v-md/commit/6b56ce333618034279d2a5bd28ddc5688de753e3)]:
  - @v-md/core@0.0.4

## 0.0.1

### Patch Changes

- [#7](https://github.com/v-md/v-md/pull/7) [`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20) Thanks [@gkn1234](https://github.com/gkn1234)! - - Modify the core mechanism of file uploading in `@v-md/core`. When the `MIME` type of the uploaded file is a non-text type, the content will be read via `readAsDataURL` (previously it was `readAsText`) as the body of the file.
  - Implement the plugin `@v-md/plugin-static-assets-basic` to integrate the following functions into the `v-md` editor:
    - Implement the source code compilation method for binary files: When a binary file of the image type is imported via `import`, a string variable will be obtained, and the content of the string is the URL address of the resource.
    - Click on a binary file of the image type with the left mouse button to display the image preview in the editor. (It will no longer be displayed using the default code editor.)
    - Right-click on a binary file and add a new function "Upload Static Resources Remotely" to the menu functions. After clicking, the file can be uploaded to a remote server. After a successful upload, the content of the file will be replaced by the `dataURL` with the uploaded `HTTP URL`. The upload method is custom passed in through `EditorOptions.assetsUpload`. For details, see [Interface Expansion of @v-md/plugin-static-assets-basic](/plugins/static-assets-basic/src/index.ts).
  - The editor preset package `@v-md/app` integrates the plugin `@v-md/plugin-static-assets-basic` by default.
- Updated dependencies [[`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20), [`41668f3`](https://github.com/v-md/v-md/commit/41668f3dc06b23a061a7a811c9c14e5926f64ed6), [`f6385e0`](https://github.com/v-md/v-md/commit/f6385e0a49dfa8370be876cc953fbfa8d5711b20)]:
  - @v-md/shared@0.0.3
  - @v-md/core@0.0.3
