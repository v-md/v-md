import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: [
      'default',
      'html',
    ],
    outputFile: {
      html: 'vitest-output/html/index.html',
    },
    coverage: {
      enabled: false,
      include: [
        'libs/*/src',
        'packages/*/src',
      ],
      exclude: [
        ...configDefaults.coverage.exclude || [],
        '**/vitest-output/**',
      ],
      reportsDirectory: 'vitest-output/html/coverage',
    },
  },
})
