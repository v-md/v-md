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
  define: {
    CDN_URL: `${JSON.stringify(cdnUrl)}`,
    CDN_TYPE: `${JSON.stringify(cdnType)}`,
    UPLOAD_URL: `${JSON.stringify(uploadUrl)}`,
  },
  base: '/v-md/',
  resolve: {
  },
  build: {
    // minify: false,
    sourcemap: true,
  },
  server: {
    port: 8080,
    host: true,
  },
  preview: {
    port: 8090,
    host: true,
  },
})
