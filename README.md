[toc]

# v-md
`v-md` 是一款基于 [Vue](https://vuejs.org/) 的在线 Markdown 编辑器。

不同于主流的 Markdown 编辑器，它是由编译器驱动的，因此你可以在 Markdown 中混用 Vue 语法，进行更加灵活的内容展示：

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

[点击前往演练场查看 Demo 效果](https://vmd.openx.huawei.com/playground/)

## 快速上手
`v-md` 是以 npm 包的形式发布的，你可以将它集成到自己的 Web 应用中。

### 安装依赖
首先在你的项目中创建 `.npmrc` 文件，在其中添加以下内容：
```ini
@v-md:registry=https://cmc.centralrepo.rnd.huawei.com/artifactory/api/npm/product_npm/
```

接着使用自己的包管理工具(`npm/yarn/pnpm`)安装必要的依赖：
```sh
npm install -S @v-md/app monaco-editor-core vue
```

依赖说明如下：
- `@v-md/app`: 编辑器应用。
- `monaco-editor-core`: 编辑器核心依赖 [Monaco Editor](https://microsoft.github.io/monaco-editor/)。
- `vue`: 编辑器核心依赖 [Vue](https://vuejs.org/)。

### 在代码中集成
在你的 Web 应用代码中引入编辑器：
```js
import { createEditor } from '@v-md/app'

const editor = createEditor({
  // 设置编辑器挂载 DOM 节点的属性与样式
  attrs: {
    style: { height: '100vh' },
  },
  // npm 中心仓资源地址
  cdnUrl: 'https://unpkg.openx.huawei.com',
  // npm 中心仓的类型，支持 unpkg 或 jsdelivr
  cdnType: 'unpkg',
  // 编辑器初始内容。不传则展示初始模板
  value: '',
  // 更多选项 ...
})

// 挂载到指定的 DOM 节点
editor.mount('#app')
```

你也可以参考 [Demo 的代码](./websites/playground/src/main.ts)，了解编辑器的基础使用。

**注意：** 编辑器的 API 文档当前正在建设中，但是我们发布的 npm 包提供了完整的 `.d.ts` 类型提示，你可以借助 IDE 的智能提示功能了解编辑器的 API，目前也可以自行查找源码中的类型声明：
- [createEditor 创建编辑器实例](./libs/core/src/modules/editor/types.ts)
- [createViewer 渲染内容](./libs/renderer/src/types.ts)

### (可选)安装 Vue 语言服务
为了解决 `Web Worker` 在不同构建工具中的兼容性问题，`0.0.3` 版本开始，编辑器默认不再集成语言服务功能。

如果需要在编辑时获得 `Vue`、`Javascript`、`TypeScript` 的语言服务，需要单独安装插件：
```sh
npm i -S @v-md/plugin-editor-volar
```

然后在使用时引入插件，传入必要的两个 `Web Worker`，语言服务方可正常工作(下面的例子仅在构建工具为 `Vite` 时有效，`Webpack` 等其他构建工具需要根据 `Web Worker` 的用法自行调整)。
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
  // 更多选项 ...
})

// 挂载到指定的 DOM 节点
editor.mount('#app')
```

## 功能特性
`v-md` 不仅仅是一个单纯的 Markdown 编辑器，由于其编译器驱动的特点，可以支持更复杂、更灵活的编辑场景。

### 支持 Vitepress 的 Markdown 拓展语法
编辑器本身的 Markdown 语法支持已经比较完善，在此基础上，`v-md` 还支持 [Vitepress 的 Markdown 拓展语法](https://vitepress.dev/zh/guide/markdown)。

[点此查看 DEMO 示例](https://vmd.openx.huawei.com/playground/?files=false#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)

**注意：** 由于目前暂未实现 Markdown 主题 CSS，所以 Markdown 内容看不出样式，但是渲染出的 HTML 结构是完全符合预期的。
我们可以在入口文件中引入样式，或者等待后续 Markdown 主题功能完成

### 支持在 Markdown 中使用 Vue
和 [VitePress](https://vitepress.dev/zh/guide/using-vue) 一样，编辑器支持在 Markdown 中直接使用 Vue 语法，包括：
- 支持在 `<script setup>` 中声明变量，并进行模板绑定
- 支持在 `<style>` 中声明样式

[点此查看 DEMO 示例](https://vmd.openx.huawei.com/playground/?files=false#eNqNVG1qGzEQvYqq/LBD7N2EUgquE1JCSltIW9pAKVEg8u7YVrwrCX34A7PQ/z1BL9AzhP7oaVJ6jY603sSOIQRsg+Y9ad7Mm/HFkkpeAu1RUWplXLfkOrm2StIOFfaNKnIwtDfkhYUOzZR0IB2Sl0wSwlZ3LKM9EiMhNvUQzoyOndO2l6Ze6skoURrkPBl7PgORZKpMkXdccAfWpbnAHzwnxksnSkjAlt2BUTMLBsUwGt6uOnVOm+FTdcqKSfyg0gkszhf6voozrmnVuS9N5jBPyvzxmvo2M0I7YsF5fcRk/RRZEgNDUpGhUSVpocoWk0ziNetIaUfkMODt1lsoCkW+KlPkz1q7DSFTWNGKso9RJodeZk4oSXiet3frtkVWMuWFh729WFM/rcWgDCZ3yHIZU1WIICak9o5Mu6XKoThkFCFGSRq5/YF3Dl8/zgqRTRDENIwenYQTOYN+WuOR+015MuZTIJELeUhTC64qEnywZJmUi66DuYuZL/79/PP396/bm++3Nz8u243Bs9ksGXCR++BrLPLq6gqnYtUDjvUfxFgUaN2iAMw/PmiKL5TpYYfyV7F0JpucG/jO/v5LPhzWHGzP6pVN84PP68aXXMjE2cd9v/M5M4Dz+FrrB26vCAGow2kzUPUoNNfa+N1NytDBdmuHax3mYENg0LOuz+Ewy6EYPX3jsMNaFGA+6jBEm5vnuBmBq5fv9MsH7CCjcWkCeG3nNaIN4FpNcUnvMBwkX6y2dutiDX4Gqwofcta0gZc5yljjcZz/2bvYKiFH5/Z0jsptI9IZD5vU99vxbAzZ5D6+vvXoxMmTSn+evLh7byocfMJyH2i5YBS9Y/QyJtj+D2lcodXlf3K4w98=)

### 完整的 Vue 演练场
编辑器本身也是非常完整的**Vue 演练场**，支持 `vue`、`js`、`ts`、`css`、`json` 文件以及文件之间的互相导入。

[点此查看 DEMO 示例](https://vmd.openx.huawei.com/playground/#eNqVVctu00AU/ZWRWSSVElu0FJBJoyJUJJB4CLqrK9Wxb5JpPA/NjBNXkRewYYn4CfgGBL9TwY5f4M7YsWMiWlgkk5lzH2fOvXdytvZ4zMALPa0Sb+BR/VRkKSgvNCqHgZcIboAbxBFM5jRLFXAvbN2eCCb9ZQ4d32mc6Y7zSCeKSkM0mFySLOazo8gzOvLGkYo42mlDpBJSkyOSwpRyeG13o7WFCbG5QqKNonxmT8pxf8+uo6CK66K4AwNMZrEBd0LIKKXL+idu5Hi9drFIWQ61iZUZBbKF0ZYkWaw1cmNXw5WKpQRVc7QWaKMzYcaY1i6NY/D3LMDTNkdrOAoaol45aMSkPIXCT7S+WU2/ZUdqhSZCoW1I7sqCaJHRlChIH1WYjNMUhQvJQ1m4o3I7Z25opn1zS0oopFCGTHOeGCo46kSTRX9vkz7OQJl+78f7r9cfvv388vn646df39/1XJEw2/n2HZmNNGSx9C+14DenXdvgUe2D7RJiQqdy5GHP2X3kzY2ROgyCnMvFzBcSeOHP83gF1E8EC9Du2AqtDaqPX7j3Vc4NZeCDZsOJEisNCslEno1dDqqcOsFQVcoSLxFZpgu4Or2S7S1exHK3fCz9j1kYR7wKRewgkakSjPT8AIcx2ExWrzGpgaZLWmRdFYSUnQiutK2RlbvBDd6PT+nMFQFt2lHiuHFk7K2qUUAdpeBI3w4D4kNyd//ALvsH9+xyeP+Bc5vkxmCOY0cGXd2KPqeKzmagRkFl4GJcXFzY1ENbR44T49iVqDMCLpgTAE27utu7b2vOYspv7d5WJQXYCo+lbJTqCGyB6rgWmaUI4gO1cevjZ89nAvun37uDE4gt3iVo+Wzz6+j8T81uxaY4T6+knbRu0+ObNQOsgu37k7cvocDfrl8teKmLCpEKsKOXOB8NxkSaZ/XA7DhW4BvAhwNbRvDKbJLzFGls2cVZJlbPnFT4npzqkwKZ6w1J94fRMX2+e57MIVm059sDh5WwFb/96gf+YRNvSQ3+VYD+g8tZhI9kGnnnLsHu+G6qgk/Tb5s6Z7M=)

### 支持直接引入 `npm` 中心仓中 `ESM` 格式的依赖
如果一个 npm 制品仓提供了 `esm` 格式的脚本，我们可以通过在 `/import-map.json` 文件中声明依赖名称(路径)与资源地址的对应关系，来直接在代码中引入这些依赖，而不需要通过 `npm install` 等方式安装到本地。

关于 `/import-map.json`，它遵循浏览器 `<script type="importmap">` 的原生机制，具体可以参考 [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap)。

当然，`v-md` 还进行了拓展，支持了 `css`、`json` 等非脚本格式的远程依赖导入。

```json
{
  "imports": {
    "vue": "https://unpkg.openx.huawei.com/vue@latest/dist/vue.runtime.esm-browser.js",
    "element-plus": "https://unpkg.openx.huawei.com/element-plus@latest/dist/index.full.min.mjs",
    "element-plus/": "https://unpkg.openx.huawei.com/element-plus@latest/",
    "@element-plus/icons-vue": "https://unpkg.openx.huawei.com/@element-plus/icons-vue@2/dist/index.min.js"
  },
  "scopes": {}
}
```

```ts
// 除了 ESM 脚本，css、json 也支持远端导入
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

[点此查看 DEMO 示例](https://vmd.openx.huawei.com/playground/#eNqlVl1uGzcQvgrLPMgBrBXcnxdVEdzGLpoAaY04QB68BkztjiTGXJIguZIMQUDfe4JeoGcI8pDTJMg1MiR3pVUce70JIK0ocr75+WaWMxdrKlkBdEh5oZVx/YLp5I1Vkh5Sbv9QIgdDh1MmLBzSTEkH0qHwOpWEpBXGpnRIwo7fW5Tg/6d07py2w8GglPp6ligNcpXMS7YEnmSqGKDcsWAOrBvkHB/4PzGldLyABGzRnxi1tGDQmZQe1spBQIEe9LUog9VWK03Anjkuc1gl01KIpOAyKe40M/hmOw2Fx3saORJp+w8l6g7s8Y/NQHwMPgRvcBPMptRmqCsmZ5NK/GBOr+Hm1Y3e5fsF03RzuCuCqCy/P/sjmxmuHbHgSj1OZVRF1sTAlGzI1KiC9NDFXuPoVPxeOqfk9rwZ1U5wb7sZYGYbUqHYns4huw6hniDIQVie5tyFxQuwls3i5jkwk83j0jGDi9qJO7jdWcKMPMe34Ss+DzTLrtFCeFsQkEqPdqSwM/LEM3HQ+xOEUOS1MiL/offYi4wGkTokLZWPyHodxDeYGzzjUpeOLPqFykE8SSkepZQMguzFp//ef3z3/4e3/3x4++/lQV0yy+UymTCel75SgoWrqyt8IStfGHpyFPaqI+9rKDyJpuvYvPlKZJTzBckEs9bbn/R/TimaJ2QEoj8J+RufwJSVwo2w5OutfQnisMAQrg0vmLlBDWdx1Q6xZZZh3hByHlftEC6nCuWf4U+78JIZySWyOn4dV+2QnMkZGESchMU+YIQVugj5aSeOaMG4HJ/5ZwfyalhnCitgRyIrVEc6K1RnUivcd1NrVCnz8Uv/7EJthH0DtRHYldqI6kptRHWnNuLaqf1Sz9DfgqgoXpqoKOMmExDuofvprJH+Dm7H7disceFCbwdWbNao6qJvx+0o3YaIzaAdt2W0hsV2sw9scGrdjQBczo9in8qUUGaIHSH/NXThFKcNrOJ4iNTNuOxPFFoshuTIQBGlsFNUeva7tm+GzY5d4AuUOHt/w9524cwAzia/af31Nu0P4nY9VuSxs9WwA/w+TgosLXfQe8S09m1tz0HvT9M/h1OInPLZw4dK7GSaCzB/a8exi+0Nl5iwGWBx+bHp9PwvWOF6O2S9sat4og3g5LjAFG3PsKeWopq3bgHj4UuwSpTeZhSb4PuDbjTkGLbz5bNAFRbSK3u6Qs9t7aQzZRw3tqLPb+9nvsZ3+81xDTPx9EGh/5T8stW34A7OMNwvfLlIKeYupZfBwO3hr84K3Vx+BhqJMQ0=)

通过这种方式，我们可以在编辑器中使用 `npm` 生态中的大部分工具了。我们也可以将自己的组件发布到 npm 上，通过部署 unpkg 的方式获得资源分发地址([UNPKG 的私有化部署参考](https://openx.huawei.com/unpkg-inhuawei/overview))，从而在编辑器中使用。

### 基于已有内容继续编辑
可以通过编辑器实例对象的属性 `editor.files.value.value` 获取编辑内容。编辑内容是将当前文件系统的 `json` 对象进行 `base64` 编码后的字符串。
```ts
import { createEditor } from '@v-md/app'

const editor = createEditor({
  // 选项 ...
})
editor.mount('#app')

// 获取编辑内容
console.log(editor.files.value.value)
```

在编辑场景，可以通过 `createEditor` 的 `value` 选项传入初始内容，编辑器会以传入的内容展示。
```ts
import { createEditor } from '@v-md/app'

const value = 'eNqtVl1u2zgQvgqXfXAKxDKyPy9e18huk8V2gW6DpkAfogChpbHNhiIJkrIdGAb63hP0Aj1D0YeepkWv0SEp2XLStLJRIJEpcr75+WbEmYsllawA2qe80Mq4bsF08soqSQ8pt/8okYOh/TETFg5ppqQD6VB4mUpC0gpjU9onYcfvzUrw7ymdOqdtv9crpb6eJEqDXCTTks2BJ5kqeih3LJgD63o5xwe+J6aUjheQgC26I6PmFgw6k9LDWjkIKNCDrhZlsPpDK03Aljkuc1gk41KIpOAyKe4109vbTkPh8ZZGjkTablui7sEe/9oMxMfgQ/AGV8FsSm2GumJyVqnEP8zpNdy8uNGbfD9lmq4ON0UQleXfz/7AZoZrRyy4Ug9TGVWRJTEwJisyNqogHXSx0zg6FX+Xzim5Pm9GtRHc2m4GmNmGVCi2x1PIrkOoJwhyEJanOXdh8RSsZZO4eQ7MZNO4dMzgonbiHm7RUir9iyOFnZBHPrCDzr8ghCIvlRH5L52HXmTQi0wgB6l8QJbLIL5CqvGMS106MusWKgfxKKV4lFLSC7IXX95+/Pzh3af3rz+9f3N5UFfAfD5PRoznpU98sHB1dYXfV+ULQ0+Owp4/ImSQ8xnJBLPWqx91f08pavcVNwDRHQW+hycwZqVwAyzReuu2DHFYEqhCG14wc4NazuKqDciWWYZcI+g8rtqAuBwrRDzBnzbic2Ykl0jf8GVctQHlTE7AIOYkLG5DBlhds5CMdkQSLRiXwzP/3InMGrgHpRV0Z2Ir3M70Vrg9SK6QP4lqo0qZD5/7525UR+BeVEfo7lRH3O5UR9w+VEdkO6rvauv7Ww7VxUsR1WXcZALCxfQjemusv2XbIDfs1shwabeBVuzWuOo6b4PcULwOFS/9Nsg1wzUwNpbb0A3HA+tuBOByehR7UqaEMn1sF/mfoeOmOFlgjcdDJHHCZXek0GbRJ0cGiiiFbaTSs92hfeNrducCP7HE2e8353XHzQzgHPKX1t9uyf4gbtcjRB7bXg07wP+HSYHF5g46D5jWvudtOej9afrncOKQYz5pP0Bim9NcgHmmHccWtzVIYtImgGXmR6TT8/9hgev1QPXKLuKJNoBT4gyTtD7DhluKara6A4yHz8EqUXqbUWyEXxS60ZBj2OvnTwJVWEwv7OkCPbe1k86UcbRYi/53dz/ztb7Zb45mmInHrUL/LfljrW/GHZxhuLd8uUgp5i6ll8HA3UGvzgpdXX4F1YYZAQ=='

const editor = createEditor({
  value
})
```

### 渲染编辑内容
可以通过编辑器实例对象的属性 `editor.files.compiledValue.value` 获取渲染内容。渲染内容是将当前的编译产物代码进行 `base64` 编码后的字符串。
```ts
import { createEditor } from '@v-md/app'

const editor = createEditor({
  // 选项 ...
})
editor.mount('#app')

// 获取渲染内容
console.log(editor.files.compiledValue.value)
```

之后可以通过 `renderer` 组件渲染内容，渲染内容会放在一个 `iframe` 容器中，与主应用的样式、脚本都是隔离的。
```ts
import { createViewer } from '@v-md/app'

const value = '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'

createViewer('#app', {
  cdnUrl: 'https://unpkg.openx.huawei.com',
  value,
})
```

当然，如果应用不需要编辑，仅仅需求内容渲染，推荐安装 `@v-md/renderer` 组件，它只包含渲染部分代码，体积更小，安装更快。
```sh
npm install -S @v-md/renderer
```

```ts
import { createViewer } from '@v-md/renderer'

// 使用内容渲染
```

`@v-md/renderer` 更是提供了 `umd` 产物，支持直接在浏览器脚本中引用：
```html
<script src="https://unpkg-openx.openx.huawei.com/@v-md/renderer@latest/dist/index.umd.js"></script>
<script>
  window.VmdRenderer.createViewer('#app', {
    // ...
  })
</script>
```

## 插件
`v-md` 实现了较为完善的插件系统，可以很大程度上对于编辑器进行扩展。当前编辑器的大部分功能都是通过插件实现的，`@v-md/app` 本质上是 `@v-md/core` 的编辑器核心集成了所有官方插件的一套预设。当前所有官方插件如下：
- [@v-md/plugin-editor-theme](./plugins/editor-theme/README.md): 编辑区代码高亮，编辑器主题样式。
- [@v-md/plugin-editor-volar](./plugins/editor-volar/README.md): 集成 [Volar](https://github.com/vuejs/language-tools) 插件，提供 Vue/JS/TS 语言服务。
- [@v-md/plugin-files-basic](./plugins/files-basic/README.md): 编辑器初始内容预设。
- [@v-md/plugin-toolbar-basic](./plugins/toolbar-basic/README.md): 编辑器顶部工具栏预设(架构已实现，但是尚未实装具体的工具类选项)。
- [@v-md/plugin-lang-css](./plugins/lang-css/README.md): CSS 语言能力。
- [@v-md/plugin-lang-js](./plugins/lang-js/README.md): JavaScript 语言能力。
- [@v-md/plugin-lang-json](./plugins/lang-json/README.md): JSON 语言能力。
- [@v-md/plugin-lang-ts](./plugins/lang-ts/README.md): TypeScript 语言能力。
- [@v-md/plugin-lang-vue](./plugins/lang-vue/README.md): Vue 语言能力。
- [@v-md/plugin-lang-vue-jsx](./plugins/lang-vue-jsx/README.md): 支持使用 JSX 语法。
- [@v-md/plugin-vue-md](./plugins/lang-vue-md/README.md): 支持 `VitePress` 的 Vue Markdown 语法，以及 Markdown 渲染区的相关的代码高亮能力。
- [@v-md/plugin-theme](./plugins/theme/README.md): 内容区基础主题设置。

**如果你不想使用全部插件，** 希望在更细的粒度自行控制编辑器的能力，那就在集成编辑器时不要使用 `@v-md/app`，改为安装核心库 `@v-md/core` 以及你需要的插件即可。例如你只需要 vue 编辑器，不需要 markdown 的编辑能力，并且不需要 `ts`、`jsx` 拓展的脚本能力，那么可以按照以下方式安装：
```sh
npm i -S @v-md/core @v-md/plugin-editor-highlight @v-md/plugin-editor-volar @v-md/plugin-lang-css @v-md/plugin-lang-js @v-md/plugin-lang-vue
```

集成时需要手动注册插件
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

### 使用插件
`createEditor` 的选项 `plugin` 支持传入一个函数，函数中能够获取到编辑器实例。

此时可以通过 `editor.use(plugin: Plugin): Editor` 方法注册插件，通过 `editor.eject(pluginName: string): Editor` 方法传入插件名称卸载插件。

**相同名称的插件只能注册一次，重复注册会提示错误。**

```ts
import { createEditor } from '@v-md/app'

const myPlugin = {
  name: 'my-plugin',

  // 插件逻辑 ...
}

const editor = createEditor({
  plugin: (editor) => {
    // 注册插件
    editor.use(myPlugin)

    // 卸载插件
    editor.eject('my-plugin')

    // 默认注册的官方插件也可在此处卸载。此处卸载的是 @v-md/plugin-editor-theme 插件
    editor.eject('editor-theme')
  },
})
```

### 插件开发
插件本质上是一种发布订阅模式。它是一个对象，需要我们实现其中的生命周期方法。被注册插件的生命周期方法会在编辑器执行特定行为时触发，从而允许我们自定义编辑器各个阶段的行为。

[点击查看插件对象的接口定义](./libs/core/src/modules/plugin/types.ts)

插件的生命周期流程如下：

![](./assets/plugin-lifecycle.png)

开发参考：
- 如何为编辑器新增一种语言支持。([参考 @v-md/plugin-lang-vue](./plugins/lang-vue/src/index.ts))
- 如何拓展编辑器顶部标题栏功能。([参考 @v-md/plugin-toolbar-basic](./plugins/toolbar-basic/src/index.ts))

## 如何贡献

- 问题、建议反馈：[前往提交 Issue](https://open.codehub.huawei.com/innersource/openx/openx-fe/vue-md/issues)
- 代码贡献：参考 [CONTRIBUTING.md]
