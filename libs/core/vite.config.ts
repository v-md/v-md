import type { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { getExternalDependencies } from '../../build/external'

/**
 * // https://vitejs.dev/config/
 *
 * mode 取值：
 * - 空值，构建 es 产物
 */
export default defineConfig(async () => {
  const externals = await getExternalDependencies()

  return {
    plugins: [
      vue(),
      dts({
        entryRoot: __dirname,
        pathsToAliases: false,
        include: ['src'],
      }),
    ],
    build: {
      lib: {
        entry: {
          index: 'src',
          renderer: 'src/renderer',
          plugin: 'src/plugin',
        },
        formats: ['es'],
        cssFileName: 'style',
      },
      minify: false,
      sourcemap: false,
      emptyOutDir: true,
      rollupOptions: {
        external: externals,
        output: {
          // Put chunk files at <output>/chunks
          chunkFileNames: 'chunks/[name].[hash].js',
          // Put chunk styles at <output>/assets
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[name].js',
        },
      },
    },
  } as UserConfig
})
