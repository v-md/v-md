<script setup lang="ts">
import type { MenuItemProps } from '../types/menu-item'
import { useRenderSlot } from '../../common'
import {
  useDefaultProps,
  useNamespace,
} from '../../config-provider'
import { Icon } from '../../icon'

const initialProps = withDefaults(
  defineProps<MenuItemProps>(),
  {
    split: undefined,
    collapse: undefined,
    active: undefined,
    disabled: undefined,
    dropdownVisible: undefined,
  },
)

const props = useDefaultProps('menuItemDefault', initialProps, () => ({
}))

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('menu', 'item', ...names)
}

const collapseSrc = () => import('../assets/arrow-right.svg').then(m => m.default)

const MenuItemDropdown = useRenderSlot(() => props.dropdown)
</script>

<template>
  <li
    v-if="props.split"
    v-bind="$attrs"
    :class="c('split')" />
  <li
    v-else
    v-bind="$attrs"
    :class="[c()]">
    <div>
      <Icon v-if="props.icon" v-bind="props.icon" />
      <span :class="c('label')">{{ props.label }}</span>
    </div>
    <Icon
      v-if="props.collapse"
      :class-name="c('collapse', 'icon')"
      :src="collapseSrc" />
    <span v-else :class="c('key', 'binding')">{{ props.keyBinding }}</span>
  </li>
</template>

<style lang="scss">
@use "../styles/menu-item";
</style>
