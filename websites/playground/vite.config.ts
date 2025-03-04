import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    vue(),
    // 产物测试时注意注释掉 ts path 插件
    tsconfigPaths(),
    // 产物测试注意注释掉此插件
    nodePolyfills({
      include: [],
      globals: {
        Buffer: true,
      },
    }),
  ],
  base: '/playground/',
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
