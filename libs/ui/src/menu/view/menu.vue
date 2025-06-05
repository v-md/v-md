<script setup lang="ts">
import { useNamespace } from '../../config-provider'
import { MenuContext } from '../composables'

const { c } = useNamespace()
MenuContext.setup()
</script>

<template>
  <ul :class="[c('menu')]">
    <slot />
  </ul>
</template>

<style lang="scss">
@use "../styles/menu";
</style>
