<script setup lang="ts">
import {
  SplitLayoutItem,
  useNamespace,
} from '@v-md/ui'

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('layout-main-content', ...names)
}
</script>

<template>
  <SplitLayoutItem :class="c()" min-size="80" auto-fill>
    content
  </SplitLayoutItem>
</template>

<style lang="scss">
@use "../styles/layout-main-content";
</style>
