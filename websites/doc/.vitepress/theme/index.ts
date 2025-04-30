import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Demo from '../../shared/components/demo.vue'

import '../../shared/styles/index.scss'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Demo', Demo)
  },
} satisfies Theme
