import { env } from 'node:process'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths'
import {
  defineConfig,
  readEnv,
  vue,
} from '../../build'

delete env.CDN_URL
delete env.CDN_TYPE
delete env.UPLOAD_URL

readEnv()

const cdnUrl = env.CDN_URL || 'https://cdn.jsdelivr.net/npm'
const cdnType = env.CDN_TYPE || 'jsdelivr'
const uploadUrl = env.UPLOAD_URL || ''

export default defineConfig({
  plugins: [
    vue(),
    // 产物测试注意注释掉此插件
    tsconfigPaths(),
    // 产物测试注意注释掉此插件
    nodePolyfills({
      include: [],
      globals: {
        Buffer: true,
      },
    }),
  ],
  optimizeDeps: {
    exclude: [
      // @v-md/plugin-lang-sass 插件引入时，要解决 sass 的依赖产物问题
      'sass',
    ],
  },
  define: {
    CDN_URL: `${JSON.stringify(cdnUrl)}`,
    CDN_TYPE: `${JSON.stringify(cdnType)}`,
    UPLOAD_URL: `${JSON.stringify(uploadUrl)}`,
  },
  base: '/v-md/',
  build: {
    // minify: false,
    sourcemap: true,
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 5183,
    host: true,
  },
})
