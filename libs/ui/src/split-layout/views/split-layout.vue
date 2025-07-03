<script setup lang="ts">
import type { SplitLayoutEmits, SplitLayoutExpose, SplitLayoutProps } from '../types'
import { SplitLayoutContext } from '../composables'
import { defaultSplitLayoutProps } from '../types'

const props = withDefaults(
  defineProps<SplitLayoutProps>(),
  defaultSplitLayoutProps(),
)

const emit = defineEmits<SplitLayoutEmits>()

// 创建组件上下文
const context = SplitLayoutContext.setup(props, emit)

const {
  containerEl,
  namespace,
} = context

function c(...names: string[]) {
  return namespace.c('split-layout', ...names)
}

// 暴露方法
const expose: SplitLayoutExpose = {
  getSizes: () => context.getSizes(),
}

defineExpose(expose)
</script>

<template>
  <div ref="containerEl" :class="[c(), c(direction)]">
    <slot />
  </div>
</template>

<style lang="scss">
@use "../styles/split-layout";
</style>
