import type {
  UserConfig,
} from '../../build'
import {
  defineConfig,
  dtsPlugin,
  getExternalDependencies,
  vue,
} from '../../build'

/**
 * // https://vitejs.dev/config/
 */
export default defineConfig(async () => {
  const externals = await getExternalDependencies()

  return {
    plugins: [
      dtsPlugin(),
      vue(),
    ],
    build: {
      lib: {
        entry: 'src',
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
