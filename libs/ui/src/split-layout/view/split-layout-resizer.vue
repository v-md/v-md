<script setup lang="ts">
import type { SplitLayoutResizerEmits, SplitLayoutResizerExpose, SplitLayoutResizerProps } from '../types'
import { computed } from 'vue'
import { useNamespace } from '../../config-provider'
import { SplitLayoutResizerContext } from '../composables'
import { ResizerSizeNormalizer } from '../composables/utils'
import { defaultSplitLayoutResizerProps } from '../types'

const props = withDefaults(
  defineProps<SplitLayoutResizerProps>(),
  defaultSplitLayoutResizerProps(),
)

const emit = defineEmits<SplitLayoutResizerEmits>()

const { c } = useNamespace()

// 标准化分割线大小值
const normalizedSize = computed(() => ResizerSizeNormalizer.normalize(props.size))

// 创建组件上下文
const context = new SplitLayoutResizerContext({
  ...props,
  size: normalizedSize.value,
})

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
const resizerStyle = computed(() => ({
  flexBasis: normalizedSize.value,
}))

// 计算CSS类名
const resizerClasses = computed(() => [
  c('split-layout-resizer'),
  {
    [c('split-layout-resizer-active')]: context.isResizing.value,
    [c('split-layout-resizer-disabled')]: props.disabled,
  },
])

// 暴露方法
const expose: SplitLayoutResizerExpose = {}

defineExpose(expose)
</script>

<template>
  <div
    :ref="(el) => { context.resizerEl.value = el as any }"
    :class="resizerClasses"
    :data-vmd-split-layout-resizer="true"
    :style="resizerStyle"
    @mousedown="handleResizeStart"
    @touchstart="handleResizeStart" />
</template>

<style lang="scss">
@use "../styles/split-layout-resizer";
</style>
