import type { UserWorkspaceConfig } from 'vitest/config'
import { mergeConfig } from 'vitest/config'

export type ProjectTestConfig = Exclude<UserWorkspaceConfig['test'], undefined>

export function vitestBaseConfig(config: UserWorkspaceConfig['test']) {
  return mergeConfig(
    {
      environment: 'jsdom',
      alias: [
        // 处理 monaco-editor-core 在 vitest 中无法正确解析的问题。https://github.com/vitest-dev/vitest/discussions/1806
        {
          find: 'monaco-editor-core',
          replacement: 'monaco-editor-core/esm/vs/editor/editor.main',
        },
      ],
    } as ProjectTestConfig,
    config || {},
  ) as ProjectTestConfig
}
