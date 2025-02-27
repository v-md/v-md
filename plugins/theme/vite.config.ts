import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { getExternalDependencies } from '../../build/external'

/**
 * // https://vitejs.dev/config/
 */
export default defineConfig(async () => {
  const externals = await getExternalDependencies()

  return {
    plugins: [
      dts({
        entryRoot: __dirname,
        pathsToAliases: false,
        include: ['src'],
      }),
    ],
    build: {
      lib: {
        entry: 'src',
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
