<script setup lang="ts">
import {
  SplitLayout,
  SplitLayoutItem,
  SplitLayoutResizer,
  useNamespace,
} from '@v-md/ui'
import LayoutActivity from './layout-activity.vue'
import LayoutMain from './layout-main.vue'
import LayoutSideMain from './layout-side-main.vue'
import LayoutSideSub from './layout-side-sub.vue'

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('layout-center', ...names)
}
</script>

<template>
  <div :class="c()">
    <LayoutActivity />
    <SplitLayout>
      <LayoutSideMain />
      <SplitLayoutItem min-size="300" auto-fill>
        <LayoutMain />
      </SplitLayoutItem>
      <LayoutSideSub />
    </SplitLayout>
  </div>
</template>

<style lang="scss">
@use "../styles/layout-center";
</style>
