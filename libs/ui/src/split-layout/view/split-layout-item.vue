<script setup lang="ts">
import type { SplitLayoutItemExpose, SplitLayoutItemProps } from '../types'
import { cssSizeToPixels } from '@v-md/shared'
import { computed } from 'vue'
import { SplitLayoutItemContext } from '../composables'
import { defaultSplitLayoutItemProps } from '../types'

const props = withDefaults(
  defineProps<SplitLayoutItemProps>(),
  defaultSplitLayoutItemProps(),
)

// 创建组件上下文
const context = new SplitLayoutItemContext(props)

const { itemEl } = context

function c(...names: string[]) {
  return context.layout.itemClassName(...names)
}

// 计算动态样式
const itemStyle = computed(() => {
  const { direction } = context.layout.props
  const isHorizontal = direction === 'horizontal'

  // 获取容器尺寸信息用于单位转换
  const containerEl = context.itemEl.value?.parentElement
  const containerSize = containerEl ?
      (isHorizontal ? containerEl.clientWidth : containerEl.clientHeight) :
    0

  const style: Record<string, string | undefined> = {}

  // 转换主尺寸为 px 单位
  if (context.currentSize) {
    const sizeInPx = containerSize > 0 ?
        cssSizeToPixels(context.currentSize, containerSize) :
      context.currentSize
    style.flex = `0 0 ${typeof sizeInPx === 'number' ? `${sizeInPx}px` : sizeInPx}`
  }
  else {
    style.flex = `0 0 ${context.currentSize}`
  }

  // 根据方向设置最小/最大尺寸约束，统一转换为 px
  if (isHorizontal) {
    if (context.currentMinSize) {
      const minSizeInPx = containerSize > 0 ?
          cssSizeToPixels(context.currentMinSize, containerSize) :
        context.currentMinSize
      style.minWidth = typeof minSizeInPx === 'number' ? `${minSizeInPx}px` : minSizeInPx
    }
    if (context.currentMaxSize) {
      const maxSizeInPx = containerSize > 0 ?
          cssSizeToPixels(context.currentMaxSize, containerSize) :
        context.currentMaxSize
      style.maxWidth = typeof maxSizeInPx === 'number' ? `${maxSizeInPx}px` : maxSizeInPx
    }
  }
  else {
    if (context.currentMinSize) {
      const minSizeInPx = containerSize > 0 ?
          cssSizeToPixels(context.currentMinSize, containerSize) :
        context.currentMinSize
      style.minHeight = typeof minSizeInPx === 'number' ? `${minSizeInPx}px` : minSizeInPx
    }
    if (context.currentMaxSize) {
      const maxSizeInPx = containerSize > 0 ?
          cssSizeToPixels(context.currentMaxSize, containerSize) :
        context.currentMaxSize
      style.maxHeight = typeof maxSizeInPx === 'number' ? `${maxSizeInPx}px` : maxSizeInPx
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
