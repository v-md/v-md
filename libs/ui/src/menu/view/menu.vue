<script setup lang="ts">
import { useNamespace } from '../../config-provider'

const { c } = useNamespace()
</script>

<template>
  <ul :class="[c('menu')]">
    <slot />
  </ul>
</template>

<style lang="scss">
@use "../styles/menu";
</style>
