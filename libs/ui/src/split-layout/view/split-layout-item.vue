<script setup lang="ts">
import type { SplitLayoutItemExpose, SplitLayoutItemProps } from '../types'
import { computed } from 'vue'
import { useNamespace } from '../../config-provider'
import { SplitLayoutItemContext } from '../composables'
import { defaultSplitLayoutItemProps } from '../types'

const props = withDefaults(
  defineProps<SplitLayoutItemProps>(),
  defaultSplitLayoutItemProps(),
)

const { c } = useNamespace()

// 创建组件上下文
const context = new SplitLayoutItemContext(props as Required<SplitLayoutItemProps>)

// 计算动态样式，使用内部状态
const itemStyle = computed(() => {
  const isHorizontal = context.splitLayout.props.direction === 'horizontal'
  return {
    flex: `0 0 ${context.currentSize}`,
    minWidth: isHorizontal ? context.currentMinSize || undefined : undefined,
    minHeight: !isHorizontal ? context.currentMinSize || undefined : undefined,
    maxWidth: isHorizontal ? context.currentMaxSize || undefined : undefined,
    maxHeight: !isHorizontal ? context.currentMaxSize || undefined : undefined,
  }
})

// 暴露方法
const expose: SplitLayoutItemExpose = {
  updateSize: (size: string) => context.updateSize(size),
}

defineExpose(expose)
</script>

<template>
  <div
    :ref="(el) => { context.itemEl.value = el as any }"
    :class="[c('split-layout', 'item')]"
    :data-vmd-split-layout-item="true"
    :style="itemStyle">
    <slot />
  </div>
</template>

<style lang="scss">
@use "../styles/split-layout-item";
</style>
