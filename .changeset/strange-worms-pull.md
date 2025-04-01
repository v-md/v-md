---
"@v-md/plugin-static-assets-basic": patch
"@v-md/core": patch
"@v-md/app": patch
---

- A new hook `onFileUpload` has been added to the plugin system, allowing you to customize the file upload process.
```ts
export interface Plugin {
  // ...
  onFileUpload?: (file: File, files: FileManager, result: FileOptions) => Promisable<void>
}
```
- The plugin `@v-md/plugin-static-assets-basic` has extended the `EditorOptions.assetsUploadAuto` option for the editor core configuration. When this option is set to `true`, the upload method `EditorOptions.assetsUpload` will be automatically called to complete the HTTP upload when a file is uploaded, eliminating the need for manual upload.
- The plugin `@v-md/plugin-static-assets-basic` has extended the file menu with the option "Download as dataURL". This option is only available after the binary resource file has been uploaded and its URL address has been obtained. Once triggered, the file will be downloaded from the URL and converted to `dataURL` as the file content.
- The plugin `@v-md/plugin-static-assets-basic` has extended the file menu with the option "Copy URL". Once triggered, you can copy the URL address of the binary resource file.
- In the image preview component of the `@v-md/plugin-static-assets-basic` plugin, a text field has been added at the bottom to display the resource address of the image.
- Fixed problem: `EditorOptions` interface in `@v-md/app` package lacks the plugin extension type.