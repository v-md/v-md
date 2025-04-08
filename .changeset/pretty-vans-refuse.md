---
"@v-md/plugin-lang-sass": patch
"@v-md/core": patch
---

- Implement `@v-md/plugin-lang-sass` to support `sass` syntax. However, it is not integrated into the preset package of `@v-md/app` by default, and users need to manually import it.
```bash
npm i -S @v-md/plugin-lang-sass
```

```ts
import { langSassPlugin } from '@v-md/plugin-lang-sass'

const editor = createEditor({
  plugins: (editor) => {
    editor.use(langSassPlugin())
    // More plugins ...
  },
  // More options ...
})
```

- `@v-md/plugin-lang-sass` implements the [Custom Importer](https://sass-lang.com/documentation/js-api/interfaces/importer/) of `sass` and supports the `@use` and `@forward` features.
- `@v-md/plugin-lang-sass` supports importing network resources, such as `@use "element-plus/theme-chalk/src/index.scss"`.
