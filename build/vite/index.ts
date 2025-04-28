import vue from '@vitejs/plugin-vue'
import tsconfigPath from 'vite-tsconfig-paths'

export * from './dts-plugin'
export * from './external'

export type { UserConfig } from 'vite'
export { defineConfig } from 'vite'
export type { PluginOptions as TsconfigPathsOptions } from 'vite-tsconfig-paths'
export {
  tsconfigPath,
  vue,
}
