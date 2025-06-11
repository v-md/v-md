<script setup lang="ts">
import type { SplitLayoutEmits, SplitLayoutExpose, SplitLayoutProps } from '../types'
import { computed, onBeforeUnmount } from 'vue'
import { useNamespace } from '../../config-provider'
import { SplitLayoutContext } from '../composables'
import { defaultSplitLayoutProps } from '../types'

const props = withDefaults(
  defineProps<SplitLayoutProps>(),
  defaultSplitLayoutProps(),
)

const emit = defineEmits<SplitLayoutEmits>()

const { c } = useNamespace()

// 创建组件上下文
const context = SplitLayoutContext.setup(props as Required<SplitLayoutProps>)

// 注册 resize 事件处理器
context.onResize((sizes) => {
  emit('resize', sizes)
})

// 计算容器类名
const containerClasses = computed(() => [
  c('split-layout'),
  c(`split-layout-${props.direction}`),
])

// 清理资源
onBeforeUnmount(() => {
  context.destroy()
})

// 暴露方法
const expose: SplitLayoutExpose = {
  getSizes: () => context.getSizes(),
}

defineExpose(expose)
</script>

<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<style lang="scss">
@use "../styles/split-layout";
</style>
