import type { Func } from '@v-md/shared'
import { EventEmitter } from '@v-md/shared'
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

describe('event emitter', () => {
  let emitter: EventEmitter<{
    testEvent: (arg: number) => void
    anotherEvent: Func
  }>

  beforeEach(() => {
    emitter = new EventEmitter()
  })

  it('should add an event listener', () => {
    const handler = vi.fn()
    emitter.on('testEvent', handler)
    expect(emitter.eventIndex('testEvent', handler)).toBe(0)
  })

  it('should add an event listener at a specific index', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    emitter.on('testEvent', handler1)
    emitter.on('testEvent', handler2, 0)
    expect(emitter.eventIndex('testEvent', handler2)).toBe(0)
    expect(emitter.eventIndex('testEvent', handler1)).toBe(1)
  })

  it('should emit an event asynchronously', async () => {
    const handler = vi.fn()
    emitter.on('testEvent', handler)
    await emitter.emit('testEvent', 42)
    expect(handler).toHaveBeenCalledWith(42)
  })

  it('should emit an event synchronously', () => {
    const handler = vi.fn()
    emitter.on('testEvent', handler)
    emitter.emitSync('testEvent', 42)
    expect(handler).toHaveBeenCalledWith(42)
  })

  it('should remove an event listener', () => {
    const handler = vi.fn()
    emitter.on('testEvent', handler)
    emitter.off('testEvent', handler)
    expect(emitter.eventIndex('testEvent', handler)).toBe(-1)
  })

  it('should clear all event listeners for a specific event', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    emitter.on('testEvent', handler1)
    emitter.on('testEvent', handler2)
    emitter.clearEvent('testEvent')
    expect(emitter.eventIndex('testEvent', handler1)).toBe(-1)
    expect(emitter.eventIndex('testEvent', handler2)).toBe(-1)
  })

  it('should clear all event listeners', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    emitter.on('testEvent', handler1)
    emitter.on('anotherEvent', handler2)
    emitter.clearAllEvents()
    expect(emitter.eventIndex('testEvent', handler1)).toBe(-1)
    expect(emitter.eventIndex('anotherEvent', handler2)).toBe(-1)
  })
})
