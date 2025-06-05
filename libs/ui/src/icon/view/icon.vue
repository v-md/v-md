<script setup lang="ts">
import type { IconProps } from '../types/icon'
import { computed } from 'vue'
import { useDynamicImport } from '../../common'
import { useNamespace } from '../../config-provider'

const props = defineProps<IconProps>()

const { c, v } = useNamespace()

const iconUrl = useDynamicImport(() => props.url)
const iconUrlStyle = computed(() => {
  if (!iconUrl.value) {
    return { color: 'transparent' }
  }
  return {
    [v('icon')]: `url("${iconUrl.value}")`,
  }
})
</script>

<template>
  <img
    v-if="type === 'img'"
    v-bind="$attrs"
    :class="[c('icon'), c('icon', 'img')]"
    :src="iconUrl">
  <i
    v-else
    v-bind="$attrs"
    :class="[c('icon'), c('icon', 'svg')]"
    :style="[iconUrlStyle]" />
</template>

<style lang="scss">
@use "../styles/icon";
</style>
