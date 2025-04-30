<script setup lang="ts">
import type { ToolbarItemProps } from '../types/toolbar-item'
import { use } from '../../common'

const props = defineProps<ToolbarItemProps>()
</script>

<template>
  <div>contents</div>
</template>

<style lang="scss">
@use "../styles/toolbar-item" as *;
</style>
