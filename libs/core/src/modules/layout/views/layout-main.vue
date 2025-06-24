<script setup lang="ts">
import {
  SplitLayout,
  useNamespace,
} from '@v-md/ui'
import LayoutMainContent from './layout-main-content.vue'
import LayoutMainPanel from './layout-main-panel.vue'

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('layout-main', ...names)
}
</script>

<template>
  <SplitLayout :class="c()" direction="vertical">
    <LayoutMainContent />
    <LayoutMainPanel />
  </SplitLayout>
</template>
