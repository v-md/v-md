import type { ImportMap, ResolveImportSourceResult } from '@v-md/shared'
import { resolveImportSource } from '@v-md/shared'
import { describe, expect, it } from 'vitest'

describe('resolve import source', () => {
  const importMap: ImportMap = {
    imports: {
      'lodash': 'https://cdn.jsdelivr.net/npm/lodash/lodash.js',
      'moment/': 'https://cdn.jsdelivr.net/npm/moment/',
    },
  }

  it('should resolve local path', () => {
    const result: ResolveImportSourceResult = resolveImportSource(importMap, './local/file.js')
    expect(result.type).toBe('local')
    expect(result.fromImportMap).toBeUndefined()
    expect(result.urlSource).toBeUndefined()
  })

  it('should resolve remote script from import map', () => {
    const result: ResolveImportSourceResult = resolveImportSource(importMap, 'lodash')
    expect(result.type).toBe('remote-script')
    expect(result.fromImportMap).toBe(true)
    expect(result.urlSource).toBe('https://cdn.jsdelivr.net/npm/lodash/lodash.js')
  })

  it('should resolve remote resource from import map', () => {
    const result: ResolveImportSourceResult = resolveImportSource(importMap, 'moment/locale/zh-cn.json')
    expect(result.type).toBe('remote-resource')
    expect(result.fromImportMap).toBe(true)
    expect(result.urlSource).toBe('https://cdn.jsdelivr.net/npm/moment/locale/zh-cn.json')
  })

  it('should resolve remote script with full URL', () => {
    const result: ResolveImportSourceResult = resolveImportSource(importMap, 'https://cdn.jsdelivr.net/npm/lodash/lodash.js')
    expect(result.type).toBe('remote-script')
    expect(result.fromImportMap).toBe(false)
    expect(result.urlSource).toBe('https://cdn.jsdelivr.net/npm/lodash/lodash.js')
  })

  it('should resolve remote resource with full URL', () => {
    const result: ResolveImportSourceResult = resolveImportSource(importMap, 'https://cdn.jsdelivr.net/npm/moment/locale/zh-cn.json')
    expect(result.type).toBe('remote-resource')
    expect(result.fromImportMap).toBe(false)
    expect(result.urlSource).toBe('https://cdn.jsdelivr.net/npm/moment/locale/zh-cn.json')
  })

  it('should return local if not found in import map', () => {
    const result: ResolveImportSourceResult = resolveImportSource(importMap, 'not-exist')
    expect(result.type).toBe('local')
    expect(result.fromImportMap).toBeUndefined()
    expect(result.urlSource).toBeUndefined()
  })
})
