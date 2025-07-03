<script setup lang="ts">
import { Icon, TabItem, useNamespace } from '@v-md/ui'

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('activity-explorer', ...names)
}
</script>

<template>
  <TabItem value="explorer">
    <Icon :url="() => import('../assets/file.svg').then(m => m.default)" />
    <template #collapse>
      explorer
    </template>
    <template #panel>
      <div :class="c()">
        explorer
      </div>
    </template>
  </TabItem>
</template>

<style lang="scss">
</style>
