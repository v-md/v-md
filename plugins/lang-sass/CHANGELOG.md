# @v-md/plugin-lang-sass

## 0.0.1

### Patch Changes

- [#11](https://github.com/v-md/v-md/pull/11) [`3bcf9aa`](https://github.com/v-md/v-md/commit/3bcf9aad74632ee34e0b18a9e520c24ab8ea1d4c) Thanks [@gkn1234](https://github.com/gkn1234)! - - Implement `@v-md/plugin-lang-sass` to support `sass` syntax. However, it is not integrated into the preset package of `@v-md/app` by default, and users need to manually import it.

  ```bash
  npm i -S @v-md/plugin-lang-sass
  ```

  ```ts
  import { langSassPlugin } from "@v-md/plugin-lang-sass";

  const editor = createEditor({
    plugins: (editor) => {
      editor.use(langSassPlugin());
      // More plugins ...
    },
    // More options ...
  });
  ```

  - `@v-md/plugin-lang-sass` implements the [Custom Importer](https://sass-lang.com/documentation/js-api/interfaces/importer/) of `sass` and supports the `@use` and `@forward` features.
  - `@v-md/plugin-lang-sass` supports importing network resources, such as `@use "element-plus/theme-chalk/src/index.scss"`.

- Updated dependencies [[`3bcf9aa`](https://github.com/v-md/v-md/commit/3bcf9aad74632ee34e0b18a9e520c24ab8ea1d4c)]:
  - @v-md/core@0.0.5
