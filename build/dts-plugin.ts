import type { PluginOptions } from 'vite-plugin-dts'
import { cwd, env } from 'node:process'
import dts from 'vite-plugin-dts'

export function dtsPlugin(options?: PluginOptions) {
  const disabled = env.DISABLE_DTS === 'true' || env.BUILD_CHECK === 'true'
  return disabled ?
    null :
      dts({
        entryRoot: cwd(),
        pathsToAliases: false,
        include: ['src'],
        ...options,
      })
}
