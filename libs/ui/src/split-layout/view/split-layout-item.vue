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

// 计算动态样式
const itemStyle = computed(() => {
  const { direction } = context.splitLayout.props
  const isHorizontal = direction === 'horizontal'

  const style: Record<string, string | undefined> = {
    flex: `0 0 ${context.currentSize}`,
  }

  // 根据方向设置最小/最大尺寸约束
  if (isHorizontal) {
    if (context.currentMinSize) {
      style.minWidth = context.currentMinSize
    }
    if (context.currentMaxSize) {
      style.maxWidth = context.currentMaxSize
    }
  }
  else {
    if (context.currentMinSize) {
      style.minHeight = context.currentMinSize
    }
    if (context.currentMaxSize) {
      style.maxHeight = context.currentMaxSize
    }
  }

  return style
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
    :class="[c('split-layout-item')]"
    :data-vmd-split-layout-item="true"
    :style="itemStyle">
    <slot />
  </div>
</template>

<style lang="scss">
@use "../styles/split-layout-item";
</style>
