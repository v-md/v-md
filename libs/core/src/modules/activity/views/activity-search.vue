<script setup lang="ts">
import { Icon, TabItem, useNamespace } from '@v-md/ui'

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('activity-search', ...names)
}
</script>

<template>
  <TabItem value="search">
    <Icon :url="() => import('../assets/search.svg').then(m => m.default)" />
    <template #collapse>
      search
    </template>
    <template #panel>
      <div :class="c()">
        search
      </div>
    </template>
  </TabItem>
</template>

<style lang="scss">
</style>
