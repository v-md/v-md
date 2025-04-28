import {
  definePlugin,
  Editor,
  EDITOR_ERR_MSG,
  EDITOR_MODEL_NAMES,
  LayoutTop,
  Plugin,
} from '@v-md/core'
import { logger } from '@v-md/shared'
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

describe('plugin basic', () => {
  it('should define plugin', () => {
    const plugin = definePlugin({
      name: 'test-plugin',
      options: {
        a: 1,
      },
    })
    expect(plugin).toBeInstanceOf(Plugin)
    expect(plugin.name).toBe('test-plugin')
    expect(plugin.options).toEqual({
      a: 1,
    })
  })

  it('plugin trigger event async', async () => {
    const onRegistered = vi.fn()
    const plugin = definePlugin({
      name: 'test-plugin',
      onRegistered,
    })
    const editor = new Editor(false)
    await plugin.trigger('onRegistered', editor, plugin)
    expect(onRegistered).toHaveBeenCalledWith(editor, plugin)
  })

  it('plugin trigger event sync', () => {
    const onRegistered = vi.fn()
    const plugin = definePlugin({
      name: 'test-plugin',
      onRegistered,
    })
    const editor = new Editor(false)
    plugin.triggerSync('onRegistered', editor, plugin)
    expect(onRegistered).toHaveBeenCalledWith(editor, plugin)
  })
})

describe('editor use plugin', () => {
  let editor: Editor
  const TEST_PLUGIN_NAME = 'test-plugin'

  beforeEach(() => {
    editor = new Editor(false)
  })

  describe('use plugin', () => {
    it('use plugin', () => {
      const plugin = definePlugin({
        name: TEST_PLUGIN_NAME,
      })
      const chain = editor.use(plugin)
      expect(chain).toBe(editor)

      const res = editor.getPlugin(TEST_PLUGIN_NAME)
      expect(res).toBe(plugin)
      expect(plugin.editor).toBe(editor)
    })

    it('should return null if plugin does not exist', () => {
      const res = editor.getPlugin('non-exist-plugin')
      expect(res).toBeNull()
    })

    it('should warn if plugin name duplicated', () => {
      const plugin = definePlugin({
        name: TEST_PLUGIN_NAME,
      })
      editor.use(plugin)

      const warnSpy = vi.spyOn(logger, 'warn')
      const anotherPlugin = definePlugin({
        name: TEST_PLUGIN_NAME,
      })
      editor.use(anotherPlugin)
      expect(warnSpy).toHaveBeenCalledWith(
        EDITOR_ERR_MSG.PLUGIN_DUPLICATED(TEST_PLUGIN_NAME),
      )
      warnSpy.mockRestore()
    })

    it('use plugin before', async () => {
      // const arrayA: number[] = []
      // const arrayB: number[] = []

      // const testEventA1 = vi.fn(() => arrayA.push(1))
      // const plugin1 = definePlugin({
      //   name: 'plugin1',
      //   testEventA: testEventA1,
      // })
      // editor.use(plugin1)

      // const testEventA2 = vi.fn(() => arrayA.push(2))
      // const testEventB2 = vi.fn(() => arrayB.push(2))
      // const plugin2 = definePlugin({
      //   name: 'plugin2',
      //   testEventA: testEventA2,
      //   testEventB: testEventB2,
      // })
      // editor.use(plugin2, {
      //   before: 'plugin1',
      // })

      // editor.triggerSync('onRegist', editor)
      // expect(registeredFn1).toHaveBeenCalledTimes(1)
      // expect(registerArray).toEqual([2, 1])

      // await editor.trigger('onRemove', editor)
      // expect(removeArray).toEqual([2])
    })

    it('use plugin after', () => {
      // const registeredFn1 = vi.fn()
      // const plugin1 = definePlugin({
      //   name: 'plugin1',
      //   onRegistered: registeredFn1,
      // })
      // editor.use(plugin1)

      // const registeredFn2 = vi.fn()
      // const removeFn2 = vi.fn()
      // const plugin2 = definePlugin({
      //   name: 'plugin2',
      //   onRegistered: registeredFn2,
      //   onRemove: removeFn2,
      // })
      // editor.use(plugin2, {
      //   after: 'plugin1',
      // })

      // const registeredFns = editor.eventList('onRegistered')
      // expect(registeredFns).toHaveLength(2)
      // expect(registeredFns?.[0]).toBe(registeredFn1)
      // expect(registeredFns?.[1]).toBe(registeredFn2)

      // const removeFns = editor.eventList('onRemove')
      // expect(removeFns).toHaveLength(1)
      // expect(removeFns?.[0]).toBe(removeFn2)
    })

    it('use plugin when both before and after options are provided', () => {
      // const registeredFn1 = vi.fn()
      // const plugin1 = definePlugin({
      //   name: 'plugin1',
      //   onRegistered: registeredFn1,
      // })
      // editor.use(plugin1)

      // const registeredFn2 = vi.fn()
      // const removeFn2 = vi.fn()
      // const plugin2 = definePlugin({
      //   name: 'plugin2',
      //   onRegistered: registeredFn2,
      //   onRemove: removeFn2,
      // })
      // editor.use(plugin2)

      // const registeredFn3 = vi.fn()
      // const removeFn3 = vi.fn()
      // const plugin3 = definePlugin({
      //   name: 'plugin3',
      //   onRegistered: registeredFn3,
      //   onRemove: removeFn3,
      // })
      // editor.use(plugin3, {
      //   before: 'plugin1',
      //   after: 'plugin2',
      // })

      // const registeredFns = editor.eventList('onRegistered')
      // expect(registeredFns).toHaveLength(2)
      // expect(registeredFns?.[0]).toBe(registeredFn1)
      // expect(registeredFns?.[1]).toBe(registeredFn2)

      // const removeFns = editor.eventList('onRemove')
      // expect(removeFns).toHaveLength(1)
      // expect(removeFns?.[0]).toBe(removeFn2)
    })

    it('should warn if specified plugin is missing', () => {

    })
  })

  describe('remove plugin', () => {
    it('remove plugin', () => {
      const plugin = definePlugin({
        name: TEST_PLUGIN_NAME,
      })
      const chain = editor
        .use(plugin)
        .eject(TEST_PLUGIN_NAME)
      expect(chain).toBe(editor)

      const res = editor.getPlugin(TEST_PLUGIN_NAME)
      expect(res).toBeNull()
      expect(() => plugin.editor).toThrow(EDITOR_ERR_MSG.NOT_READY)
    })

    it('should warn if plugin does not exist', () => {
      const warnSpy = vi.spyOn(logger, 'warn')
      const NON_EXIST_PLUGIN_NAME = 'non-exist-plugin'
      editor.eject(NON_EXIST_PLUGIN_NAME)
      expect(warnSpy).toHaveBeenCalledWith(
        EDITOR_ERR_MSG.PLUGIN_NOT_FOUND(NON_EXIST_PLUGIN_NAME),
      )
      warnSpy.mockRestore()
    })
  })
})

describe('plugin hooks', () => {
  let editor: Editor

  beforeEach(() => {
    editor = new Editor(false)
  })

  it('should call onRegistered when plugin is used', () => {
    const onRegistered = vi.fn()
    const plugin1 = definePlugin({
      name: 'plugin1',
      onRegistered,
    })
    const plugin2 = definePlugin({
      name: 'plugin2',
    })

    editor
      .use(plugin1)
      .use(plugin2)

    expect(onRegistered).toBeCalledTimes(2)
    expect(onRegistered).toHaveBeenCalledWith(editor, plugin1)
    expect(onRegistered).toHaveBeenCalledWith(editor, plugin2)
  })

  it('should call onRemove when plugin is ejected', () => {
    const onRemove = vi.fn()
    const plugin1 = definePlugin({
      name: 'plugin1',
      onRemove,
    })
    const plugin2 = definePlugin({
      name: 'plugin2',
    })
    const plugin3 = definePlugin({
      name: 'plugin3',
    })

    editor
      .use(plugin1)
      .use(plugin2)
      .use(plugin3)
      .eject('plugin2')
      .eject('plugin1')
      .eject('plugin3')

    expect(onRemove).toBeCalledTimes(2)
    expect(onRemove).toHaveBeenCalledWith(editor, plugin2)
    expect(onRemove).toHaveBeenCalledWith(editor, plugin1)
  })
})
