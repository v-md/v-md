<script setup lang="ts">
import type { IconPropsWithAttrs } from '../../icon'
import type {
  MenuItemProps,
  MenuItemSlots,
} from '../types'
import { isObjectLike } from '@v-md/shared'
import {
  computed,
} from 'vue'
import { useNamespace } from '../../config-provider'
import { Icon } from '../../icon'
import { Tippy } from '../../tippy'
import { MenuItemContext } from '../composables'
import { defaultMenuItemProps } from '../types'

const props = withDefaults(
  defineProps<MenuItemProps>(),
  defaultMenuItemProps(),
)

defineSlots<MenuItemSlots>()

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('menu', 'item', ...names)
}

const context = new MenuItemContext(props)
const {
  itemEl,
  linkEl,
  tippyEl,
  collapseEnabled,
} = context

const collapseIconProps = computed<IconPropsWithAttrs>(() => {
  if (!props.collapseIcon) {
    return {}
  }
  else if (isObjectLike(props.collapseIcon)) {
    return props.collapseIcon
  }

  return {
    url: () => import('../assets/arrow-right.svg').then(m => m.default),
  }
})
</script>

<template>
  <li
    v-if="split && !hidden"
    v-bind="$attrs"
    :class="c('split')" />
  <li
    v-else-if="!hidden"
    ref="itemEl"
    data-vmd-menu-item="true"
    v-bind="$attrs"
    :class="[c(), { [c('disabled')]: disabled }]"
    :aria-disabled="disabled">
    <a
      ref="linkEl"
      :class="c('link')"
      @click="() => context.clickHandler()">
      <Icon
        v-if="icon"
        :class="[c('icon'), c('label', 'icon')]"
        v-bind="icon" />
      <span :class="c('label')">{{ label }}</span>
      <span
        v-if="keyBinding"
        :class="c('key', 'binding')">{{ keyBinding }}</span>
      <Icon
        v-if="collapseIcon"
        :class="[c('icon'), c('collapse', 'icon')]"
        v-bind="collapseIconProps" />
    </a>
    <Tippy
      v-if="collapseEnabled"
      ref="tippyEl"
      placement="right-start"
      trigger="manual"
      interactive
      :arrow="false"
      :offset="[0, 0]"
      to="parent">
      <template #content>
        <slot />
      </template>
    </Tippy>
  </li>
</template>

<style lang="scss">
@use "../styles/menu-item";
</style>
