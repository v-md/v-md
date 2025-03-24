---
"@v-md/plugin-lang-json": patch
"@v-md/plugin-lang-css": patch
"@v-md/plugin-lang-vue": patch
"@v-md/plugin-lang-js": patch
"@v-md/plugin-lang-ts": patch
"@v-md/plugin-vue-md": patch
"@v-md/core": patch
---

The interface for obtaining relevant information based on the file suffix has been changed. Taking a `.css` file as an example, the previous extension method was:
```ts
manager.fileExtToLang.css = 'css'
manager.fileExtToIcon.css = {
  icon: import('./css.svg').then(m => m.default),
  color: '',
}
```

The new extension method is:
```ts
files.fileExtMap.css = {
  icon: import('./css.svg').then(m => m.default),
  iconColor: '',
  lang: 'css',
}
```

For the interface definition of the file suffix associated information, please refer to: [FileExtInfo Interface Definition](/libs/core/src/modules/file/types.ts) 
