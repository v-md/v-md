<script setup lang="ts">
import type { IconProps } from '../types/icon'
import { computed } from 'vue'
import { useDynamicImport } from '../../common'
import {
  useDefaultProps,
  useNamespace,
} from '../../config-provider'

const initialProps = defineProps<IconProps>()

const props = useDefaultProps('iconDefault', initialProps, () => ({
  src: '',
  type: 'svg',
  className: '',
  styles: {},
}))

const { c, v } = useNamespace()

const iconSrc = useDynamicImport(() => props.src)
const iconUrlStyle = computed(() => {
  if (!iconSrc.value) {
    return {}
  }
  return {
    [v('icon')]: `url("${iconSrc.value}")`,
  }
})
</script>

<template>
  <i
    v-if="props.type === 'svg'"
    v-bind="$attrs"
    :class="[c('icon'), c('icon', 'svg'), props.className]"
    :style="[props.styles, iconUrlStyle]" />
  <img
    v-else
    v-bind="$attrs"
    :class="[c('icon'), c('icon', 'img'), props.className]"
    :style="[props.styles]"
    :src="iconSrc">
</template>

<style lang="scss">
@use "../styles/icon";
</style>
