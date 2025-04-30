<script setup lang="ts">
import type { Slot } from '../slot'
import { onBeforeUnmount } from 'vue'

const props = defineProps<{
  data: Slot
}>()

props.data.setup()

onBeforeUnmount(() => {
  props.data.unmount()
})
</script>

<template>
  <template v-for="item in data.items" :key="item.name">
    <component :is="item.renderComponent" v-if="item.renderComponent" />
  </template>
</template>

<style scoped lang="scss">
</style>
