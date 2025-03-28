import { resolveDynamicImport } from '@v-md/shared'
import { describe, expect, it } from 'vitest'

describe('dynamic import', () => {
  it('from raw source', () => {
    const source = 'aaa'
    resolveDynamicImport(source).then((res) => {
      expect(res).toBe(source)
    })
  })

  it('from function source', () => {
    const str = 'aaa'
    const source = () => str
    resolveDynamicImport(source).then((res) => {
      expect(res).toBe(str)
    })
  })

  it('from promise source', () => {
    const str = 'aaa'
    const source = Promise.resolve('aaa')
    resolveDynamicImport(source).then((res) => {
      expect(res).toBe(str)
    })
  })

  it('from promise function source', () => {
    const str = 'aaa'
    const source = () => Promise.resolve(str)
    resolveDynamicImport(source).then((res) => {
      expect(res).toBe(str)
    })
  })
})
