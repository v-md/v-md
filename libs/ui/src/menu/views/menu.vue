<script setup lang="ts">
import type { MenuEmits, MenuProps } from '../types'
import { useNamespace } from '../../config-provider'
import { MenuContext } from '../composables'
import { defaultMenuProps } from '../types'

const props = withDefaults(
  defineProps<MenuProps>(),
  defaultMenuProps(),
)

const emit = defineEmits<MenuEmits>()

const { c } = useNamespace()
MenuContext.setup(props, emit)
</script>

<template>
  <ul :class="[c('menu')]">
    <slot />
  </ul>
</template>

<style lang="scss">
@use "../styles/menu";
</style>
