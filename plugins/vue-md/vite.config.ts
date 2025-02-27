import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { getExternalDependencies } from '../../build/external'

/**
 * // https://vitejs.dev/config/
 */
export default defineConfig(async () => {
  const externals = await getExternalDependencies({
    // @mdit-vue 系列依赖不能外部化，需要用 node-polyfills 插件处理后，打包到最终产物中
    exclude: [/^@mdit-vue\/.*/],
  })

  return {
    plugins: [
      dts({
        entryRoot: __dirname,
        pathsToAliases: false,
        include: ['src'],
      }),
      nodePolyfills({
        include: [],
        globals: {
          Buffer: true,
        },
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
