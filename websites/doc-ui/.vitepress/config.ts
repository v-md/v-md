import {
  defineConfig,
  mdPlugin,
  vitepressSideConfig,
  vitepressViteConfig,
} from '../shared'

export default defineConfig({
  title: 'v-md UI 组件',
  srcDir: 'docs',
  // 修改 cache 目录位置，默认位置可能导致异常提交到 git 仓
  cacheDir: '.cache',
  description: 'v-md UI 组件',

  vite: vitepressViteConfig({
    server: {
      port: 5273,
    },
    preview: {
      port: 5283,
    },
  }),

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  markdown: {
    config: (md) => {
      md.use(mdPlugin)
    },
  },

  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local',
    },
    nav: [
      { text: '开始', link: '/guide/' },
      { text: '组件', link: '/components/' },
    ],
    sidebar: vitepressSideConfig(),
  },
})
