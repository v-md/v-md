---
"@v-md/plugin-static-assets-basic": patch
"@v-md/core": patch
---

- 插件 `@v-md/plugin-static-assets-basic` 为编辑器核心配置拓展了 `EditorOptions.assetsUploadAuto` 选项，当此选项为 true 时，文件上传时将自动调用上传方法 `EditorOptions.assetsUpload` 完成 HTTP 上传，不再需要手动上传
- `@v-md/plugin-static-assets-basic` 为文件菜单拓展了 `下载为 dataURL` 选项：仅当二进制资源文件已经完成上传，获取到 url 地址后才可用，触发后会从 url 下载到文件，转为 `dataURL` 作为文件内容
- `@v-md/plugin-static-assets-basic` 为文件菜单拓展了 `复制 URL` 选项，触发后可以复制到该二进制资源文件的 URL 地址
- `@v-md/plugin-static-assets-basic` 的图片预览组件，下方添加了文本域，用于展示图片的资源地址