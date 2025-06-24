<script setup lang="ts">
import type { Slot } from '../model/slot'

defineProps<{
  data: Slot
}>()
</script>

<template>
  <template v-for="item in data.items" :key="item.name">
    <component :is="item.renderComponent" v-if="item.renderComponent" />
  </template>
</template>
