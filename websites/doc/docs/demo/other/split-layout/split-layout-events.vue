<script setup lang="ts">
import { SplitLayout, SplitLayoutItem, SplitLayoutResizer } from '@v-md/ui'
import { ref } from 'vue'

const resizeCount = ref(0)
const currentSizes = ref<number[]>([])
const isResizing = ref(false)

function handleResize(sizes: number[]) {
  resizeCount.value++
  currentSizes.value = [...sizes]
}

function handleResizeStart() {
  isResizing.value = true
}

function handleResizeEnd() {
  isResizing.value = false
}
</script>

<template>
  <div>
    <div style="height: 300px; border: 1px solid #ddd;">
      <SplitLayout @resize="handleResize">
        <SplitLayoutItem size="40%">
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
            <h3>左侧面板</h3>
          </div>
        </SplitLayoutItem>
        <SplitLayoutResizer
          @resize-start="handleResizeStart"
          @resize-end="handleResizeEnd" />
        <SplitLayoutItem size="60%">
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #e8f4fd;">
            <h3>右侧面板</h3>
          </div>
        </SplitLayoutItem>
      </SplitLayout>
    </div>

    <div style=" padding: 15px;margin-top: 15px; background: #f9f9f9; border-radius: 4px;">
      <p style="margin: 0 0 10px;">
        <strong>事件信息：</strong>
      </p>
      <p style="margin: 5px 0; color: #666;">
        调整次数: {{ resizeCount }}
      </p>
      <p style="margin: 5px 0; color: #666;">
        当前大小: {{ currentSizes.length ? currentSizes.map(size => `${size}px`).join(', ') : '未调整' }}
      </p>
      <p style="margin: 5px 0; color: #666;">
        拖拽状态: <span :style="{ color: isResizing ? '#f56c6c' : '#67c23a' }">
          {{ isResizing ? '拖拽中' : '已停止' }}
        </span>
      </p>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0;
  color: #333;
}
</style>
