import type {
  UserConfig,
} from '../../build'
import { env } from 'node:process'
import tsconfigPaths from 'vite-tsconfig-paths'
import {
  defineConfig,
  dtsPlugin,
  getExternalDependencies,
} from '../../build'

/**
 * // https://vitejs.dev/config/
 *
 * mode 取值：
 * - all，构建全量 umd 产物
 * - 空值，构建 es 产物
 */
export default defineConfig(async ({ mode }) => {
  const isBuildAll = mode === 'all'
  env.DISABLE_DTS = isBuildAll ? 'true' : 'false'

  const externals = await getExternalDependencies()

  return {
    plugins: [
      dtsPlugin(),
      isBuildAll ? tsconfigPaths() : null,
    ],
    build: {
      lib: {
        entry: 'src',
        name: 'VmdRenderer',
        formats: isBuildAll ? ['umd'] : ['es'],
      },
      minify: isBuildAll ? 'esbuild' : false,
      sourcemap: isBuildAll,
      emptyOutDir: !isBuildAll,
      rollupOptions: {
        external: isBuildAll ? [] : externals,
        output: {
          // Put chunk files at <output>/chunks
          chunkFileNames: 'chunks/[name].[hash].js',
          // Put chunk styles at <output>/assets
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[name].[format].js',
        },
      },
    },
  } as UserConfig
})
