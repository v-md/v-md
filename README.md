English | [简体中文](./README.zh-CN.md)

# v-md
`v-md` is an online Markdown editor based on [Vue](https://vuejs.org/).

Unlike mainstream Markdown editors, it is driven by a compiler. Therefore, you can mix Vue syntax in Markdown for more flexible content display:

````md
<script setup>
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

# {{ msg }}

<input v-model="msg" />

[百度一下](https://www.baidu.com)

```ts
const a = 1
```

<style>
h1 {
  color: red;
}
</style>
````

[Click here to go to the playground to view the Demo effect](https://v-md.github.io/v-md/)

## Quick Start
`v-md` is released as an npm package, and you can integrate it into your own web application.

### Install Dependencies
Use your own package management tool (`npm/yarn/pnpm`) to install the necessary dependencies:
```sh
npm install -S @v-md/app monaco-editor-core vue
```

Dependency descriptions are as follows:
- `@v-md/app`: Editor application.
- `monaco-editor-core`: The core dependency of the editor is [Monaco Editor](https://microsoft.github.io/monaco-editor/).
- `vue`: The core dependency of the editor is [Vue](https://vuejs.org/).

### Integrate in the Code
Import the editor in your web application code:
```js
import { createEditor } from '@v-md/app'

const editor = createEditor({
  // Set the attributes and styles of the DOM node where the editor is mounted
  attrs: {
    style: { height: '100vh' },
  },
  // The resource address of the npm central repository. By default, it is the npm address of jsdelivr
  cdnUrl: 'https://cdn.jsdelivr.net/npm',
  // The type of the npm central repository, supporting unpkg or jsdelivr. By default, it is jsdelivr
  cdnType: 'jsdelivr',
  // The initial content of the editor. If not passed, the initial template will be displayed
  value: '',
  // More options ...
})

// Mount to the specified DOM node
editor.mount('#app')
```

You can also refer to the [Demo's code](./websites/playground/src/main.ts) to understand the basic usage of the editor.

**Note:** The API documentation of the editor is currently under construction. However, the npm package we released provides complete `.d.ts` type hints. You can use the intelligent prompt function of the IDE to understand the API of the editor. Currently, you can also find the type declarations in the source code by yourself:
- [createEditor Create an editor instance](./libs/core/src/modules/editor/types.ts)
- [createViewer Render content](./libs/renderer/src/types.ts)

### (Optional) Install Vue Language Service
To solve the compatibility issues of `Web Worker` in different build tools, the editor does not integrate the language service function by default.

If you need to obtain the language services of `Vue`, `Javascript`, and `TypeScript` during editing, you need to install the plugin separately:
```sh
npm i -S @v-md/plugin-editor-volar
```

Then import the plugin when using it and pass in the necessary two `Web Worker` so that the language service can work properly (the following example is only valid when the build tool is `Vite`. Other build tools such as `Webpack` need to be adjusted according to the usage of `Web Worker` by yourself).
```js
import { createEditor } from '@v-md/app'
import { editorVolarPlugin } from '@v-md/plugin-editor-volar'
import VueWorker from '@v-md/plugin-editor-volar/vue.worker?worker'
import EditorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker'

const editor = createEditor({
  plugins: (editor) => {
    editor.use(editorVolarPlugin({
      vueWorker: new VueWorker(),
      editorWorker: new EditorWorker()
    }))
  },
  // More options ...
})

// Mount to the specified DOM node
editor.mount('#app')
```

## Functional Features
`v-md` is not just a simple Markdown editor. Due to its compiler-driven characteristics, it can support more complex and flexible editing scenarios.

### Support Vitepress's Markdown Extended Syntax
The Markdown syntax support of the editor itself is relatively complete. On this basis, `v-md` also supports [Vitepress's Markdown extended syntax](https://vitepress.dev/guide/markdown).

[Click here to view the DEMO example](https://v-md.github.io/v-md/?files=false#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)

### Support Using Vue in Markdown
Similar to [VitePress](https://vitepress.dev/guide/using-vue), the editor supports directly using Vue syntax in Markdown, including:
- Support declaring variables in `<script setup>` and performing template binding.
- Support declaring styles in `<style>`.

[Click here to view the DEMO example](https://v-md.github.io/v-md/?files=false#eNqNVG1qGzEQvYqq/LBD7N2EUgquE1JCSltIW9pAKVEg8u7YVrwrCX34A7PQ/z1BL9AzhP7oaVJ6jY603sSOIQRsg+Y9ad7Mm/HFkkpeAu1RUWplXLfkOrm2StIOFfaNKnIwtDfkhYUOzZR0IB2Sl0wSwlZ3LKM9EiMhNvUQzoyOndO2l6Ze6skoURrkPBl7PgORZKpMkXdccAfWpbnAHzwnxksnSkjAlt2BUTMLBsUwGt6uOnVOm+FTdcqKSfyg0gkszhf6voozrmnVuS9N5jBPyvzxmvo2M0I7YsF5fcRk/RRZEgNDUpGhUSVpocoWk0ziNetIaUfkMODt1lsoCkW+KlPkz1q7DSFTWNGKso9RJodeZk4oSXiet3frtkVWMuWFh729WFM/rcWgDCZ3yHIZU1WIICak9o5Mu6XKoThkFCFGSRq5/YF3Dl8/zgqRTRDENIwenYQTOYN+WuOR+015MuZTIJELeUhTC64qEnywZJmUi66DuYuZL/79/PP396/bm++3Nz8u243Bs9ksGXCR++BrLPLq6gqnYtUDjvUfxFgUaN2iAMw/PmiKL5TpYYfyV7F0JpucG/jO/v5LPhzWHGzP6pVN84PP68aXXMjE2cd9v/M5M4Dz+FrrB26vCAGow2kzUPUoNNfa+N1NytDBdmuHax3mYENg0LOuz+Ewy6EYPX3jsMNaFGA+6jBEm5vnuBmBq5fv9MsH7CCjcWkCeG3nNaIN4FpNcUnvMBwkX6y2dutiDX4Gqwofcta0gZc5yljjcZz/2bvYKiFH5/Z0jsptI9IZD5vU99vxbAzZ5D6+vvXoxMmTSn+evLh7byocfMJyH2i5YBS9Y/QyJtj+D2lcodXlf3K4w98=)

### Complete Vue Playground
The editor itself is also a very complete **Vue playground**, supporting `vue`, `js`, `ts`, `css`, `json` files and the mutual import between files.

[Click here to view the DEMO example](https://v-md.github.io/v-md/#eNqVVctu00AU/ZWRWSSVElu0FJBJoyJUJJB4CLqrK9Wxb5JpPA/NjBNXkRewYYn4CfgGBL9TwY5f4M7YsWMiWlgkk5lzH2fOvXdytvZ4zMALPa0Sb+BR/VRkKSgvNCqHgZcIboAbxBFM5jRLFXAvbN2eCCb9ZQ4d32mc6Y7zSCeKSkM0mFySLOazo8gzOvLGkYo42mlDpBJSkyOSwpRyeG13o7WFCbG5QqKNonxmT8pxf8+uo6CK66K4AwNMZrEBd0LIKKXL+idu5Hi9drFIWQ61iZUZBbKF0ZYkWaw1cmNXw5WKpQRVc7QWaKMzYcaY1i6NY/D3LMDTNkdrOAoaol45aMSkPIXCT7S+WU2/ZUdqhSZCoW1I7sqCaJHRlChIH1WYjNMUhQvJQ1m4o3I7Z25opn1zS0oopFCGTHOeGCo46kSTRX9vkz7OQJl+78f7r9cfvv388vn646df39/1XJEw2/n2HZmNNGSx9C+14DenXdvgUe2D7RJiQqdy5GHP2X3kzY2ROgyCnMvFzBcSeOHP83gF1E8EC9Du2AqtDaqPX7j3Vc4NZeCDZsOJEisNCslEno1dDqqcOsFQVcoSLxFZpgu4Or2S7S1exHK3fCz9j1kYR7wKRewgkakSjPT8AIcx2ExWrzGpgaZLWmRdFYSUnQiutK2RlbvBDd6PT+nMFQFt2lHiuHFk7K2qUUAdpeBI3w4D4kNyd//ALvsH9+xyeP+Bc5vkxmCOY0cGXd2KPqeKzmagRkFl4GJcXFzY1ENbR44T49iVqDMCLpgTAE27utu7b2vOYspv7d5WJQXYCo+lbJTqCGyB6rgWmaUI4gO1cevjZ89nAvun37uDE4gt3iVo+Wzz6+j8T81uxaY4T6+knbRu0+ObNQOsgu37k7cvocDfrl8teKmLCpEKsKOXOB8NxkSaZ/XA7DhW4BvAhwNbRvDKbJLzFGls2cVZJlbPnFT4npzqkwKZ6w1J94fRMX2+e57MIVm059sDh5WwFb/96gf+YRNvSQ3+VYD+g8tZhI9kGnnnLsHu+G6qgk/Tb5s6Z7M=)

### Support Directly Importing Dependencies in `ESM` Format from the `npm` Central Repository
If an npm artifact repository provides scripts in `esm` format, we can directly import these dependencies in the code by declaring the mapping between the dependency names (paths) and resource addresses in the `/import-map.json` file, without having to install them locally via methods like `npm install`.

Regarding `/import-map.json`, it follows the native mechanism of the browser's `<script type="importmap">`. For specific details, please refer to the [MDN documentation](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap).

Of course, `v-md` has also been extended to support the import of remote dependencies in non - script formats such as `css` and `json`.

```json
{
  "imports": {
    "vue": "https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.runtime.esm-browser.js",
    "element-plus": "https://cdn.jsdelivr.net/npm/element-plus@latest/dist/index.full.min.mjs",
    "element-plus/": "https://cdn.jsdelivr.net/npm/element-plus@latest/",
    "@element-plus/icons-vue": "https://cdn.jsdelivr.net/npm/@element-plus/icons-vue@2/dist/index.min.js"
  },
  "scopes": {}
}
```

```ts
// In addition to ESM scripts, css and json also support remote import
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'
import pkgJson from 'element-plus/package.json'
import { ref } from 'vue'
import 'element-plus/dist/index.css'
```

[Click here to view the DEMO example](https://v-md.github.io/v-md/#eNqlVl1uGzcQvgrLPMgBrBXcnxdVEdzGLpoAaY04QB68BkztjiTGXJIguZIMQUDfe4JeoGcI8pDTJMg1MiR3pVUce70JIK0ocr75+WaWMxdrKlkBdEh5oZVx/YLp5I1Vkh5Sbv9QIgdDh1MmLBzSTEkH0qHwOpWEpBXGpnRIwo7fW5Tg/6d07py2w8GglPp6ligNcpXMS7YEnmSqGKDcsWAOrBvkHB/4PzGldLyABGzRnxi1tGDQmZQe1spBQIEe9LUog9VWK03Anjkuc1gl01KIpOAyKe40M/hmOw2Fx3saORJp+w8l6g7s8Y/NQHwMPgRvcBPMptRmqCsmZ5NK/GBOr+Hm1Y3e5fsF03RzuCuCqCy/P/sjmxmuHbHgSj1OZVRF1sTAlGzI1KiC9NDFXuPoVPxeOqfk9rwZ1U5wb7sZYGYbUqHYns4huw6hniDIQVie5tyFxQuwls3i5jkwk83j0jGDi9qJO7jdWcKMPMe34Ss+DzTLrtFCeFsQkEqPdqSwM/LEM3HQ+xOEUOS1MiL/offYi4wGkTokLZWPyHodxDeYGzzjUpeOLPqFykE8SSkepZQMguzFp//ef3z3/4e3/3x4++/lQV0yy+UymTCel75SgoWrqyt8IStfGHpyFPaqI+9rKDyJpuvYvPlKZJTzBckEs9bbn/R/TimaJ2QEoj8J+RufwJSVwo2w5OutfQnisMAQrg0vmLlBDWdx1Q6xZZZh3hByHlftEC6nCuWf4U+78JIZySWyOn4dV+2QnMkZGESchMU+YIQVugj5aSeOaMG4HJ/5ZwfyalhnCitgRyIrVEc6K1RnUivcd1NrVCnz8Uv/7EJthH0DtRHYldqI6kptRHWnNuLaqf1Sz9DfgqgoXpqoKOMmExDuofvprJH+Dm7H7disceFCbwdWbNao6qJvx+0o3YaIzaAdt2W0hsV2sw9scGrdjQBczo9in8qUUGaIHSH/NXThFKcNrOJ4iNTNuOxPFFoshuTIQBGlsFNUeva7tm+GzY5d4AuUOHt/w9524cwAzia/af31Nu0P4nY9VuSxs9WwA/w+TgosLXfQe8S09m1tz0HvT9M/h1OInPLZw4dK7GSaCzB/a8exi+0Nl5iwGWBx+bHp9PwvWOF6O2S9sat4og3g5LjAFG3PsKeWopq3bgHj4UuwSpTeZhSb4PuDbjTkGLbz5bNAFRbSK3u6Qs9t7aQzZRw3tqLPb+9nvsZ3+81xDTPx9EGh/5T8stW34A7OMNwvfLlIKeYupZfBwO3hr84K3Vx+BhqJMQ0=)

In this way, we can use most of the tools in the `npm` ecosystem in the editor.

You can also publish your own components to a private npm repository and obtain the resource distribution address by deploying unpkg (refer to [Private Deployment of UNPKG](https://juejin.cn/post/7199962962630099002)) for use in the editor.

### Continue Editing Based on Existing Content
You can obtain the edited content through the `editor.files.value.value` property of the editor instance object. The edited content is a string obtained by `gzip` encoding the `json` object of the current file system.
```ts
import { createEditor } from '@v-md/app'

const editor = createEditor({
  // Options ...
})
editor.mount('#app')

// Get the edited content
console.log(editor.files.value.value)
```

In the editing scenario, you can pass in the initial content through the `value` option of `createEditor`, and the editor will display the passed - in content.
```ts
import { createEditor } from '@v-md/app'

const value = 'eNqtVl1u2zgQvgqXfXAKxDKyPy9e18huk8V2gW6DpkAfogChpbHNhiIJkrIdGAb63hP0Aj1D0YeepkWv0SEp2XLStLJRIJEpcr75+WbEmYsllawA2qe80Mq4bsF08soqSQ8pt/8okYOh/TETFg5ppqQD6VB4mUpC0gpjU9onYcfvzUrw7ymdOqdtv9crpb6eJEqDXCTTks2BJ5kqeih3LJgD63o5xwe+J6aUjheQgC26I6PmFgw6k9LDWjkIKNCDrhZlsPpDK03Aljkuc1gk41KIpOAyKe4109vbTkPh8ZZGjkTablui7sEe/9oMxMfgQ/AGV8FsSm2GumJyVqnEP8zpNdy8uNGbfD9lmq4ON0UQleXfz/7AZoZrRyy4Ug9TGVWRJTEwJisyNqogHXSx0zg6FX+Xzim5Pm9GtRHc2m4GmNmGVCi2x1PIrkOoJwhyEJanOXdh8RSsZZO4eQ7MZNO4dMzgonbiHm7RUir9iyOFnZBHPrCDzr8ghCIvlRH5L52HXmTQi0wgB6l8QJbLIL5CqvGMS106MusWKgfxKKV4lFLSC7IXX95+/Pzh3af3rz+9f3N5UFfAfD5PRoznpU98sHB1dYXfV+ULQ0+Owp4/ImSQ8xnJBLPWqx91f08pavcVNwDRHQW+hycwZqVwAyzReuu2DHFYEqhCG14wc4NazuKqDciWWYZcI+g8rtqAuBwrRDzBnzbic2Ykl0jf8GVctQHlTE7AIOYkLG5DBlhds5CMdkQSLRiXwzP/3InMGrgHpRV0Z2Ir3M70Vrg9SK6QP4lqo0qZD5/7525UR+BeVEfo7lRH3O5UR9w+VEdkO6rvauv7Ww7VxUsR1WXcZALCxfQjemusv2XbIDfs1shwabeBVuzWuOo6b4PcULwOFS/9Nsg1wzUwNpbb0A3HA+tuBOByehR7UqaEMn1sF/mfoeOmOFlgjcdDJHHCZXek0GbRJ0cGiiiFbaTSs92hfeNrducCP7HE2e8353XHzQzgHPKX1t9uyf4gbtcjRB7bXg07wP+HSYHF5g46D5jWvudtOej9afrncOKQYz5pP0Bim9NcgHmmHccWtzVIYtImgGXmR6TT8/9hgev1QPXKLuKJNoBT4gyTtD7DhluKara6A4yHz8EqUXqbUWyEXxS60ZBj2OvnTwJVWEwv7OkCPbe1k86UcbRYi/53dz/ztb7Zb45mmInHrUL/LfljrW/GHZxhuLd8uUgp5i6ll8HA3UGvzgpdXX4F1YYZAQ=='

const editor = createEditor({
  value
})
```

### Render the Edited Content
You can obtain the rendered content through the `editor.files.compiledValue.value` property of the editor instance object. The rendered content is a string obtained by `gzip` encoding the current compiled product code.
```ts
import { createEditor } from '@v-md/app'

const editor = createEditor({
  // Options ...
})
editor.mount('#app')

// Get the rendered content
console.log(editor.files.compiledValue.value)
```

After that, you can render the content through the `renderer` component. The rendered content will be placed in an `iframe` container, isolated from the styles and scripts of the main application.
```ts
import { createViewer } from '@v-md/app'

const value = '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'

createViewer('#app', {
  cdnUrl: 'https://cdn.jsdelivr.net/npm',
  value,
})
```

Of course, if your application doesn't require editing and only needs content rendering, it is recommended to install the `@v-md/renderer` component. It only contains the rendering code, has a smaller size, and can be installed more quickly.
```sh
npm install -S @v-md/renderer
```

```ts
import { createViewer } from '@v-md/renderer'

// Use content rendering
```

`@v-md/renderer` also provides a `umd` build, which supports direct reference in browser scripts:
```html
<script src="https://cdn.jsdelivr.net/npm/@v-md/renderer@latest/dist/index.umd.js"></script>
<script>
  window.VmdRenderer.createViewer('#app', {
    // ...
  })
</script>
```

## Plugins
`v-md` has implemented a relatively complete plugin system, which can greatly extend the functionality of the editor. Most of the current editor's features are implemented through plugins. Essentially, `@v-md/app` is a preset that integrates all official plugins into the editor core of `@v-md/core`. The current official plugins are as follows:
- [@v-md/plugin-editor-theme](./plugins/editor-theme/README.md): Code highlighting in the editing area and editor theme styles.
- [@v-md/plugin-editor-volar](./plugins/editor-volar/README.md): Integrates the [Volar](https://github.com/vuejs/language-tools) plugin to provide Vue/JS/TS language services.
- [@v-md/plugin-files-basic](./plugins/files-basic/README.md): Presets for the initial content of the editor.
- [@v-md/plugin-toolbar-basic](./plugins/toolbar-basic/README.md): Preset for the editor's top toolbar (the architecture has been implemented, but specific tool options have not been implemented yet).
- [@v-md/plugin-static-assets-basic](./plugins/static-assets-basic/README.md): The editor supports file uploads, processing binary files into resource URLs, uploading static resources to remote servers, and previewing image resources.
- [@v-md/plugin-lang-css](./plugins/lang-css/README.md): CSS language capabilities.
- [@v-md/plugin-lang-sass](./plugins/lang-sass/README.md): Sass language capabilities.
- [@v-md/plugin-lang-js](./plugins/lang-js/README.md): JavaScript language capabilities.
- [@v-md/plugin-lang-json](./plugins/lang-json/README.md): JSON language capabilities.
- [@v-md/plugin-lang-ts](./plugins/lang-ts/README.md): TypeScript language capabilities.
- [@v-md/plugin-lang-vue](./plugins/lang-vue/README.md): Vue language capabilities.
- [@v-md/plugin-lang-vue-jsx](./plugins/lang-vue-jsx/README.md): Supports the use of JSX syntax.
- [@v-md/plugin-vue-md](./plugins/lang-vue-md/README.md): Supports the Vue Markdown syntax of `VitePress` and the relevant code highlighting capabilities in the Markdown rendering area.
- [@v-md/plugin-theme](./plugins/theme/README.md): Basic theme settings for the content area.

**If you don't want to use all the plugins,** and hope to have more fine - grained control over the editor's capabilities, then don't use `@v-md/app` when integrating the editor. Instead, install the core library `@v-md/core` and the plugins you need. For example, if you only need a Vue editor, don't need Markdown editing capabilities, and don't need the extended scripting capabilities of `ts` and `jsx`, you can install them as follows:
```sh
npm i -S @v-md/core @v-md/plugin-editor-highlight @v-md/plugin-editor-volar @v-md/plugin-lang-css @v-md/plugin-lang-js @v-md/plugin-lang-vue
```

You need to manually register the plugins during integration.
```ts
import { Editor } from '@v-md/core'
import { editorThemePlugin } from '@v-md/plugin-editor-theme'
import { editorVolarPlugin } from '@v-md/plugin-editor-volar'
import VueWorker from '@v-md/plugin-editor-volar/vue.worker?worker'
import { langCssPlugin } from '@v-md/plugin-lang-css'
import { langJsPlugin } from '@v-md/plugin-lang-js'
import { langVuePlugin } from '@v-md/plugin-lang-vue'
import EditorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker'

const editor = Editor.init({
  plugins: (editor) => {
    editor
      .use(editorVolarPlugin({
        vueWorker: new VueWorker(),
        editorWorker: new EditorWorker()
      }))
      .use(langCssPlugin())
      .use(langJsPlugin())
      .use(langVuePlugin())
      .use(editorThemePlugin())
  },
})

editor.mount('#app')
```

### Using Plugins
The `plugin` option of `createEditor` supports passing in a function, through which you can obtain the editor instance.

At this time, you can register a plugin using the `editor.use(plugin: Plugin): Editor` method and uninstall a plugin by passing in the plugin name using the `editor.eject(pluginName: string): Editor` method.

**Plugins with the same name can only be registered once. Repeated registration will prompt an error.**

```ts
import { createEditor } from '@v-md/app'

const myPlugin = {
  name: 'my-plugin',

  // Plugin logic ...
}

const editor = createEditor({
  plugin: (editor) => {
    // Register the plugin
    editor.use(myPlugin)

    // Uninstall the plugin
    editor.eject('my-plugin')

    // You can also uninstall the default registered official plugins here. Here, the @v-md/plugin-editor-theme plugin is uninstalled.
    editor.eject('editor-theme')
  },
})
```

### Plugin Development
A plugin is essentially a publish - subscribe pattern. It is an object, and we need to implement its lifecycle methods. The lifecycle methods of the registered plugins will be triggered when the editor performs specific actions, allowing us to customize the behavior of the editor at various stages.

[Click to view the interface definition of the plugin object](./libs/core/src/modules/plugin/types.ts)

Development references:
- How to add support for a new language to the editor. ([Refer to @v-md/plugin-lang-vue](./plugins/lang-vue/src/index.ts))
- How to extend the functionality of the editor's top title bar. ([Refer to @v-md/plugin-toolbar-basic](./plugins/toolbar-basic/src/index.ts))
