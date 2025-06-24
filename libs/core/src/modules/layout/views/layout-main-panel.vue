<script setup lang="ts">
import {
  SplitLayoutItem,
  SplitLayoutResizer,
  useNamespace,
} from '@v-md/ui'

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('layout-main-panel', ...names)
}
</script>

<template>
  <SplitLayoutResizer :class="c('border')" size="1" />
  <SplitLayoutItem
    v-bind="$attrs"
    :class="c()"
    min-size="80"
    size="250">
    panel
  </SplitLayoutItem>
</template>

<style lang="scss">
@use "../styles/layout-main-panel";
</style>
