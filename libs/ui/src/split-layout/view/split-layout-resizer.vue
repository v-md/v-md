<script setup lang="ts">
import type { SplitLayoutResizerEmits, SplitLayoutResizerExpose, SplitLayoutResizerProps } from '../types'
import { computed } from 'vue'
import { useNamespace } from '../../config-provider'
import { SplitLayoutResizerContext } from '../composables'
import { defaultSplitLayoutResizerProps } from '../types'

const props = withDefaults(
  defineProps<SplitLayoutResizerProps>(),
  defaultSplitLayoutResizerProps(),
)

const emit = defineEmits<SplitLayoutResizerEmits>()

const { c } = useNamespace()

// 创建组件上下文
const context = new SplitLayoutResizerContext(props as Required<SplitLayoutResizerProps>)

// 注册结束事件处理器
context.setResizeEndHandler(() => {
  emit('resize-end')
})

// 处理拖拽开始
function handleResizeStart(event: MouseEvent | TouchEvent) {
  emit('resize-start')
  context.startResize(event)
}

// 计算样式
const resizerStyle = computed(() => {
  const disabled = props.disabled
  const isHorizontal = context.splitLayout.props.direction === 'horizontal'

  return {
    flexBasis: props.size,
    cursor: disabled ? 'not-allowed' : (isHorizontal ? 'col-resize' : 'row-resize'),
  }
})

// 暴露方法
const expose: SplitLayoutResizerExpose = {}

defineExpose(expose)
</script>

<template>
  <div
    :ref="(el) => { context.resizerEl.value = el as any }"
    :class="[
      c('split-layout', 'resizer'),
      {
        [c('split-layout-resizer', 'active')]: context.isResizing.value,
        [c('split-layout-resizer', 'disabled')]: props.disabled,
      },
    ]"
    :data-vmd-split-layout-resizer="true"
    :style="resizerStyle"
    @mousedown="handleResizeStart"
    @touchstart="handleResizeStart" />
</template>

<style lang="scss">
@use "../styles/split-layout-resizer";
</style>
