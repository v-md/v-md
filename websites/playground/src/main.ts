import type { LayoutTop } from '@v-md/app'
import { Editor } from '@v-md/app'
import { h } from 'vue'

const editor = new Editor()
const layoutTop = editor.getModel<LayoutTop>('layout-top')
layoutTop.slots.left.addItem({
  name: 'left-1',
  component: h('div', null, ['left']),
})
editor.mount('#app')
