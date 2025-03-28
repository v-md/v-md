import type {
  UserConfig,
} from '../../build'
import {
  defineConfig,
  dtsPlugin,
  getExternalDependencies,
  vitestBaseConfig,
} from '../../build'

/**
 * // https://vitejs.dev/config/
 */
export default defineConfig(async () => {
  const externals = await getExternalDependencies()

  return {
    plugins: [
      dtsPlugin(),
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
