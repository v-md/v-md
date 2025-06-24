<script setup lang="ts">
import {
  SplitLayoutItem,
  SplitLayoutResizer,
  useNamespace,
} from '@v-md/ui'

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('layout-side-main', ...names)
}
</script>

<template>
  <SplitLayoutItem
    :class="c()"
    v-bind="$attrs"
    size="300"
    min-size="200">
    main
  </SplitLayoutItem>
  <SplitLayoutResizer :class="c('border')" size="1" />
</template>

<style lang="scss">
@use "../styles/layout-side-main";
</style>
