<script setup lang="ts">
import { useNamespace } from '@v-md/ui'
import LayoutBottom from './layout-bottom.vue'
import layoutCenter from './layout-center.vue'
import LayoutTop from './layout-top.vue'

const { c: className } = useNamespace()
function c(...names: string[]) {
  return className('layout', ...names)
}
</script>

<template>
  <div id="vmd-app" :class="c()">
    <LayoutTop />
    <layoutCenter />
    <LayoutBottom />
  </div>
</template>

<style lang="scss">
@use "../styles/layout";
</style>
