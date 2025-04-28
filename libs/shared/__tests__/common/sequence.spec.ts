import type { SequenceItem } from '@v-md/shared'
import {
  getItemFromSequence,
  insertIntoSequence,
  removeFromSequence,
  resoveSequencePositionOptions,
} from '@v-md/shared'
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

describe('resolve insert options', () => {
  it('should return "before" mode if before option is provided', () => {
    const result = resoveSequencePositionOptions({ before: 'item2' })
    expect(result).toEqual({ name: 'item2', mode: 'before' })
  })

  it('should return "after" mode if after option is provided', () => {
    const result = resoveSequencePositionOptions({ after: 'item2' })
    expect(result).toEqual({ name: 'item2', mode: 'after' })
  })

  it('should return "end" mode if neither before nor after option is provided', () => {
    const result = resoveSequencePositionOptions()
    expect(result).toEqual({ name: '', mode: 'end' })
  })

  it('should ignore after option if before option is also provided', () => {
    const result = resoveSequencePositionOptions({ before: 'item2', after: 'item3' })
    expect(result).toEqual({ name: 'item2', mode: 'before' })
  })
})

function defaultSequence() {
  return [
    { name: 'item1' },
    { name: 'item2' },
    { name: 'item3' },
  ]
}

describe('get item from sequence', () => {
  let sequence: SequenceItem[]

  beforeEach(() => {
    sequence = defaultSequence()
  })

  it('should return the item if it exists in the sequence', () => {
    const item = getItemFromSequence(sequence, 'item2')
    expect(item).toEqual({ name: 'item2' })
  })

  it('should return null if the item does not exist in the sequence', () => {
    const item = getItemFromSequence(sequence, 'item4')
    expect(item).toBeNull()
  })
})

describe('insert into sequence', () => {
  let sequence: SequenceItem[]

  beforeEach(() => {
    sequence = defaultSequence()
  })

  it('insert the item at the end if no options are provided', () => {
    const res = insertIntoSequence(sequence, { name: 'item4' })
    expect(res).toBe(true)
    expect(sequence).toEqual([
      { name: 'item1' },
      { name: 'item2' },
      { name: 'item3' },
      { name: 'item4' },
    ])
  })

  it('insert the item before the specified item', () => {
    const res = insertIntoSequence(
      sequence,
      { name: 'item4' },
      { before: 'item2' },
    )
    expect(res).toBe(true)
    expect(sequence).toEqual([
      { name: 'item1' },
      { name: 'item4' },
      { name: 'item2' },
      { name: 'item3' },
    ])
  })

  it('insert the item after the specified item', () => {
    const res = insertIntoSequence(
      sequence,
      { name: 'item4' },
      { after: 'item2' },
    )
    expect(res).toBe(true)
    expect(sequence).toEqual([
      { name: 'item1' },
      { name: 'item2' },
      { name: 'item4' },
      { name: 'item3' },
    ])
  })

  it('insert the item before the specified item if both before and after options are provided', () => {
    const res = insertIntoSequence(
      sequence,
      { name: 'item4' },
      { before: 'item2', after: 'item3' },
    )
    expect(res).toBe(true)
    expect(sequence).toEqual([
      { name: 'item1' },
      { name: 'item4' },
      { name: 'item2' },
      { name: 'item3' },
    ])
  })

  it('insert duplicate item', () => {
    const onDuplicate = vi.fn()
    const res = insertIntoSequence(
      sequence,
      { name: 'item2' },
      { onDuplicate },
    )
    expect(res).toBe(false)
    expect(sequence).toEqual([
      { name: 'item1' },
      { name: 'item2' },
      { name: 'item3' },
    ])
    expect(onDuplicate).toHaveBeenCalled()
  })

  it('missing the specified item', () => {
    const onMissingTarget = vi.fn()
    const res = insertIntoSequence(
      sequence,
      { name: 'item4' },
      { before: 'item5', onMissingTarget },
    )
    expect(res).toBe(true)
    expect(sequence).toEqual([
      { name: 'item1' },
      { name: 'item2' },
      { name: 'item3' },
      { name: 'item4' },
    ])
    expect(onMissingTarget).toHaveBeenCalledWith('item5')
  })
})

describe('remove from sequence', () => {
  let sequence: SequenceItem[]

  beforeEach(() => {
    sequence = defaultSequence()
  })

  it('remove the item if it exists in the sequence', () => {
    const onNotFound = vi.fn()
    const onBeforeRemove = vi.fn()
    const res = removeFromSequence(sequence, 'item2', {
      onNotFound,
      onBeforeRemove,
    })
    expect(res).toEqual({ name: 'item2' })
    expect(sequence).toEqual([
      { name: 'item1' },
      { name: 'item3' },
    ])
    expect(onNotFound).not.toHaveBeenCalled()
    expect(onBeforeRemove).toHaveBeenCalledWith(res)
  })

  it('remove the item if it does not exist in the sequence', () => {
    const onNotFound = vi.fn()
    const onBeforeRemove = vi.fn()
    const res = removeFromSequence(sequence, 'item4', {
      onNotFound,
      onBeforeRemove,
    })
    expect(res).toBeNull()
    expect(sequence).toEqual([
      { name: 'item1' },
      { name: 'item2' },
      { name: 'item3' },
    ])
    expect(onNotFound).toHaveBeenCalled()
    expect(onBeforeRemove).not.toHaveBeenCalled()
  })
})
