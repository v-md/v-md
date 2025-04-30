<script setup lang="ts">
import type { IconProps } from '../types/icon'
import { computed } from 'vue'
import { useDynamicImport } from '../../common'

const props = defineProps<IconProps>()

const { result: iconSrc } = useDynamicImport(() => props.src)
const iconUrlStyle = computed(() => {
  if (!iconSrc.value) {
    return {}
  }
  return {

  }
})
</script>

<template>
  <i
    v-if="type === 'svg'"
    class="vmd-toolbar-icon"
    :class="[className]"
    :style="{ '--vmd-icon': iconUrlCss }" />
  <img v-else class="vmd-toolbar-img" :src="iconUrl">
</template>

<style lang="scss">
@use "../styles/icon.scss" as *;
</style>
