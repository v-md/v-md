<script setup lang="ts">
import {
  SplitLayoutItem,
  SplitLayoutResizer,
  useNamespace,
} from '@v-md/ui'

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('layout-side-sub', ...names)
}
</script>

<template>
  <SplitLayoutResizer :class="c('border')" size="1" />
  <SplitLayoutItem
    :class="c()"
    v-bind="$attrs"
    size="600"
    min-size="200">
    333
  </SplitLayoutItem>
</template>

<style lang="scss">
@use "../styles/layout-side-sub";
</style>
