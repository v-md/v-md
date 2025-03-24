import type { UserWorkspaceConfig } from 'vitest/config'
import { mergeConfig } from 'vitest/config'

export type ProjectTestConfig = Exclude<UserWorkspaceConfig['test'], undefined>

export function vitestBaseConfig(config: UserWorkspaceConfig['test']) {
  return mergeConfig(
    {
      environment: 'jsdom',
      alias: [
        {
          find: 'monaco-editor-core',
          replacement: 'monaco-editor-core/esm/vs/editor/editor.main',
        },
      ],
    } as ProjectTestConfig,
    config || {},
  ) as ProjectTestConfig
}
