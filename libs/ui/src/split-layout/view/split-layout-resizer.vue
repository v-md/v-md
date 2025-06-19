<script setup lang="ts">
import type { SplitLayoutResizerEmits, SplitLayoutResizerExpose, SplitLayoutResizerProps } from '../types'
import { computed } from 'vue'
import { SplitLayoutResizerContext } from '../composables'
import { defaultSplitLayoutResizerProps } from '../types'

const props = withDefaults(
  defineProps<SplitLayoutResizerProps>(),
  defaultSplitLayoutResizerProps(),
)

const emit = defineEmits<SplitLayoutResizerEmits>()

// 创建组件上下文
const context = new SplitLayoutResizerContext(props, emit)

const { resizerEl, isResizing, size } = context

function c(...names: string[]) {
  return context.layout.resizerClassName(...names)
}

// 处理拖拽开始
function handleResizeStart(event: MouseEvent | TouchEvent) {
  context.startResize(event)
}

// 计算样式
const resizerStyle = computed(() => ({
  flexBasis: `${size.value}px`,
}))

// 暴露方法
const expose: SplitLayoutResizerExpose = {
  move: offset => context.move(offset),
}

defineExpose(expose)
</script>

<template>
  <div
    ref="resizerEl"
    :class="[
      c(),
      {
        [c('active')]: isResizing,
        [c('disabled')]: disabled,
      },
    ]"
    :[context.datasetTemplateKey]="true"
    :style="resizerStyle"
    @mousedown="handleResizeStart"
    @touchstart="handleResizeStart" />
</template>

<style lang="scss">
@use "../styles/split-layout-resizer";
</style>
