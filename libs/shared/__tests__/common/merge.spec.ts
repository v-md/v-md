import { mergeShallow } from '@v-md/shared'
import { describe, expect, it } from 'vitest'

describe('merge shallow', () => {
  it('should override when "override" is true', () => {
    // 测试默认状态下 override 为 true
    const merged1 = mergeShallow(
      {},
      { a: 1 },
      { a: 2 },
    )
    expect(merged1).toEqual({ a: 2 })

    const merged2 = mergeShallow(
      { override: true },
      { a: 1 },
      { a: 2 },
    )
    expect(merged2).toEqual({ a: 2 })
  })

  it('should not override when "override" is false', () => {
    const merged1 = mergeShallow(
      { override: false },
      { a: 1 },
      { a: 2 },
    )
    expect(merged1).toEqual({ a: 1 })

    const merged2 = mergeShallow(
      { override: false },
      { a: undefined },
      { a: 2 },
    )
    expect(merged2).toEqual({ a: undefined })

    const merged3 = mergeShallow(
      { override: false },
      {},
      { a: 2 },
    )
    expect(merged3).toEqual({ a: 2 })
  })

  it('ignore undefined when "ignoreUndef" is true', () => {
    const merged1 = mergeShallow(
      { ignoreUndef: true },
      { a: 1 },
      { a: undefined },
    )
    expect(merged1).toEqual({ a: 1 })

    const merged2 = mergeShallow(
      { override: false, ignoreUndef: true },
      { a: undefined },
      { a: 1 },
    )
    expect(merged2).toEqual({ a: 1 })
  })

  it('create new object when "createNew" is true', () => {
    const raw1 = {
      a: 1,
      b: { x: 1 },
    }

    const newObj1 = {
      a: 2,
      b: { y: 2 },
    }

    const merged1 = mergeShallow({ createNew: true }, raw1, newObj1)

    expect(merged1).toEqual({
      a: 2,
      b: { y: 2 },
    })
    expect(merged1).not.toBe(raw1)
    expect(merged1).not.toBe(newObj1)
    expect(merged1.b).not.toBe(raw1.b)
    expect(merged1.b).toBe(newObj1.b)

    const raw2 = {
      a: 1,
      b: { x: 1 },
    }

    const newObj2 = {
      a: 2,
    }

    // createNew 默认为 true
    const merged2 = mergeShallow({}, raw2, newObj2)
    expect(merged2).toEqual({
      a: 2,
      b: { x: 1 },
    })
    expect(merged2).not.toBe(raw2)
    expect(merged2).not.toBe(newObj2)
    expect(merged2.b).not.toBe(raw2.b)
  })

  it('should return b when a is not object', () => {
    let merged = mergeShallow(
      {},
      'a',
      'b',
    )
    expect(merged).toBe('b')

    const b = { b: 1 }
    merged = mergeShallow(
      { createNew: false },
      'a',
      b,
    )
    expect(merged).toBe(b)

    merged = mergeShallow(
      { createNew: true },
      'a',
      b,
    )
    expect(merged).not.toBe(b)
    expect(merged).toEqual(b)
  })

  it('should return a when b is not object', () => {
    const a = { a: 1 }
    let merged = mergeShallow(
      {},
      a,
      'b',
    )
    expect(merged).not.toBe(a)
    expect(merged).toEqual(a)

    merged = mergeShallow(
      { createNew: false },
      a,
      'b',
    )
    expect(merged).toBe(a)
  })
})
