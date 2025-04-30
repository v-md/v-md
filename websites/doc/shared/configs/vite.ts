import type { UserConfig } from 'vitepress'
import { mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export function vitepressViteConfig(options: UserConfig['vite'] = {}) {
  return mergeConfig({
    plugins: [
      tsconfigPaths(),
    ],
    server: {
      host: true,
    },
    preview: {
      host: true,
    },
  }, options) as UserConfig['vite']
}
