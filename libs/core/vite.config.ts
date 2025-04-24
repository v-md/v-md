import type {
  UserConfig,
} from '../../build/vite'
import {
  defineConfig,
  dtsPlugin,
  getExternalDependencies,
  vue,
} from '../../build/vite'
import { vitestBaseConfig } from '../../build/vitest'

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
      dtsPlugin(),
    ],
    test: vitestBaseConfig({ name: 'core' }),
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
