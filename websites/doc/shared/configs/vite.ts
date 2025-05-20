import type { UserConfig } from 'vitepress'
import { mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { postcssIsolateStyles } from 'vitepress'

export function vitepressViteConfig(options: UserConfig['vite'] = {}) {
  const rawOptions: UserConfig['vite'] = {
    plugins: [
      tsconfigPaths(),
    ],
    css: {
      postcss: {
        plugins: [
          postcssIsolateStyles({
            includeFiles: [/vp-doc\.css/], // 默认为 /base\.css/
          }),
        ],
      },
    },
    server: {
      host: true,
    },
    preview: {
      host: true,
    },
  }

  return mergeConfig(rawOptions, options) as UserConfig['vite']
}
