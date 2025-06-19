<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { SplitLayoutItemExpose, SplitLayoutItemProps } from '../types'
import { computed } from 'vue'
import { SplitLayoutItemContext } from '../composables'
import { defaultSplitLayoutItemProps } from '../types'

const props = withDefaults(
  defineProps<SplitLayoutItemProps>(),
  defaultSplitLayoutItemProps(),
)

// 创建组件上下文
const context = new SplitLayoutItemContext(props)

const {
  itemEl,
  layout,
  size,
  maxSize,
  minSize,
} = context

function c(...names: string[]) {
  return context.layout.itemClassName(...names)
}

const itemStyle = computed(() => {
  const style: CSSProperties = {}

  if (size.value >= 0) {
    style.flexBasis = `${size.value}px`
  }

  if (maxSize.value >= 0) {
    if (layout.isHorizontal.value) {
      style.maxWidth = `${maxSize.value}px`
    }
    else {
      style.maxHeight = `${maxSize.value}px`
    }
  }

  if (minSize.value >= 0) {
    if (layout.isHorizontal.value) {
      style.minWidth = `${minSize.value}px`
    }
    else {
      style.minHeight = `${minSize.value}px`
    }
  }

  return style
})

// 暴露方法
const expose: SplitLayoutItemExpose = {
  updateSize: val => context.updateSize(val),
}

defineExpose(expose)
</script>

<template>
  <div
    ref="itemEl"
    :class="[c()]"
    :[context.datasetTemplateKey]="true"
    :style="itemStyle">
    <slot />
  </div>
</template>

<style lang="scss">
@use "../styles/split-layout-item";
</style>
