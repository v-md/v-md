/* eslint-disable no-alert */
import { createEditor, createViewer } from '@v-md/app'
import { editorVolarPlugin } from '@v-md/plugin-editor-volar'
import { setOrCreate } from '@v-md/shared'
// 产物测试时需要手动引入样式
// import '@v-md/app/dist/assets/style.css'

const url = new URL(location.href)
const {
  origin,
  pathname,
  hash,
  search,
} = url

const noFilesNav = /files=false/.test(search)
const isView = /view=true/.test(search)

if (isView) {
  createViewer('#app', {
    cdnUrl: CDN_URL,
    value: hash.slice(1),
  })
}
else {
  const editor = createEditor({
    attrs: {
      style: {
        height: '100vh',
      },
      navVisible: !noFilesNav,
    },
    cdnUrl: CDN_URL,
    cdnType: CDN_TYPE,
    value: hash.slice(1),
    plugins: (editor) => {
      editor.use(editorVolarPlugin({
        vueWorker: async () => {
          const { default: VueWorker } = await import('@v-md/plugin-editor-volar/vue.worker?worker')
          return new VueWorker()
        },
        editorWorker: async () => {
          const { default: EditorWorker } = await import('monaco-editor-core/esm/vs/editor/editor.worker?worker')
          return new EditorWorker()
        },
      }))
    },
    toolbars: {
      preview: {
        items: [
          {
            name: 'jump',
            type: 'button',
            icon: import('./assets/eye.svg').then(m => m.default),
            tip: '查看预览效果',
            onTrigger: (app) => {
              window.open(`${origin}${pathname}?view=true#${app.files.compiledValue.value}`, '_blank')
            },
          },
          {
            name: 'copy-edit-code',
            type: 'button',
            icon: import('./assets/copy.svg').then(m => m.default),
            tip: '复制预览码',
            onTrigger: (app) => {
              navigator.clipboard.writeText(app.files.compiledValue.value).then(() => {
                alert('复制成功')
              }).catch(() => {
                alert('复制失败')
              })
            },
          },
          {
            name: 'copy-view-code',
            type: 'button',
            icon: import('./assets/copy.svg').then(m => m.default),
            tip: '复制编辑码',
            onTrigger: (app) => {
              navigator.clipboard.writeText(app.files.value.value).then(() => {
                alert('复制成功')
              }).catch(() => {
                alert('复制失败')
              })
            },
          },
          {
            name: 'files-nav',
            type: 'switch',
            icon: import('./assets/folder-cancel.svg').then(m => m.default),
            tip: '禁用文件导航',
            value: noFilesNav,
            onTrigger: (app, value) => {
              setOrCreate(app.options, 'attrs', 'navVisible', value)
            },
          },
        ],
      },
    },
  })

  editor.mount('#app')
}
