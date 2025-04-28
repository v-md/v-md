import type {
  UserConfig,
} from '../../build/vite'
import {
  defineConfig,
  dtsPlugin,
  getExternalDependencies,
  tsconfigPath,
} from '../../build/vite'
import { vitestBaseConfig } from '../../build/vitest'

/**
 * // https://vitejs.dev/config/
 */
export default defineConfig(async () => {
  const externals = await getExternalDependencies()

  return {
    plugins: [
      dtsPlugin(),
      tsconfigPath(),
    ],
    test: vitestBaseConfig({ name: 'shared' }),
    build: {
      lib: {
        entry: {
          index: 'src',
          browser: 'src/browser',
        },
        formats: ['es'],
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
