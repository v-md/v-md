import type { LayoutTopModel } from '@v-md/app'
import { Editor, pluginBasic } from '@v-md/app'
import { h } from 'vue'

const editor = new Editor().use(pluginBasic({
  attrs: {
    style: { height: '100vh' },
  },
}))
const layoutTop = editor.getModel<LayoutTopModel>('layout-top')
layoutTop.slots.left.addItem({
  name: 'left-1',
  component: h('div', null, ['left11111111111111111']),
})
layoutTop.slots.right.addItem({
  name: 'right-1',
  component: h('div', null, ['right']),
})
layoutTop.slots.center.addItem({
  name: 'center-1',
  component: h('div', null, ['center']),
})
editor.mount('#app')
