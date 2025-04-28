import type { Functionable } from '@v-md/shared'
import type { Plugin } from './types'
import { isFunction } from '@v-md/shared'

export * from './types'

export function definePlugin(options: Functionable<Plugin>) {
  return isFunction(options) ? options() : options
}
