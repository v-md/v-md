<script setup lang="ts">
import type { ToolbarItemOptions } from '../../modules/toolbar'
import { resolveDynamicImport } from '@v-md/shared'
import {
  computed,
  ref,
  watch,
} from 'vue'

const props = withDefaults(defineProps<{
  icon?: ToolbarItemOptions['icon']
  iconType?: ToolbarItemOptions['iconType']
}>(), {
  icon: '',
  iconType: 'svg',
})

const iconUrl = ref(typeof props.icon === 'string' ? props.icon : '')
const iconUrlCss = computed(() => `url("${iconUrl.value}")`)

watch(() => props.icon, (val) => {
  resolveDynamicImport(val).then((res) => {
    iconUrl.value = res
  })
}, { immediate: true })
</script>

<template>
  <i
    v-if="iconType === 'svg'"
    class="vmd-toolbar-icon"
    :style="{ '--vmd-icon': iconUrlCss }" />
  <img v-else class="vmd-toolbar-img" :src="iconUrl">
</template>

<style lang="scss">
@use "../../styles/mixins.scss" as *;

.vmd-toolbar-icon {
  @include icon;

  font-size: 18px;
}

.vmd-toolbar-img {
  width: 18px;
  height: 18px;
}
</style>
