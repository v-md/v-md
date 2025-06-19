<script setup lang="ts">
import { SplitLayout, SplitLayoutItem, SplitLayoutResizer } from '@v-md/ui'
import { ref } from 'vue'

const splitLayoutRef = ref()
const itemRef = ref()
const currentSizes = ref<number[]>([])

function getSizes() {
  if (splitLayoutRef.value) {
    currentSizes.value = splitLayoutRef.value.getSizes()
  }
}

function updateLeftSize() {
  if (itemRef.value) {
    const newSize = Math.random() * 50 + 25 // 25% - 75% 之间的随机值
    itemRef.value.updateSize(`${newSize}%`)
    // 更新后获取新的大小
    setTimeout(getSizes, 100)
  }
}

// 初始获取大小
setTimeout(getSizes, 100)
</script>

<template>
  <div>
    <div style="height: 300px; border: 1px solid #ddd;">
      <SplitLayout ref="splitLayoutRef">
        <SplitLayoutItem ref="itemRef" size="30%">
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
            <h3>左侧面板</h3>
          </div>
        </SplitLayoutItem>
        <SplitLayoutResizer />
        <SplitLayoutItem size="70%">
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #e8f4fd;">
            <h3>右侧面板</h3>
          </div>
        </SplitLayoutItem>
      </SplitLayout>
    </div>

    <div style=" display: flex; gap: 10px; align-items: center;margin-top: 15px;">
      <button
        style="padding: 8px 16px; cursor: pointer; background: #fff; border: 1px solid #ddd; border-radius: 4px;"
        @click="getSizes">
        获取当前大小
      </button>
      <button
        style="padding: 8px 16px; cursor: pointer; background: #fff; border: 1px solid #ddd; border-radius: 4px;"
        @click="updateLeftSize">
        随机调整左侧大小
      </button>
    </div>

    <div style=" padding: 10px;margin-top: 15px; background: #f0f0f0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #666;">
        当前面板大小: {{ currentSizes.length ? currentSizes.map(size => `${size}px`).join(' | ') : '加载中...' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0;
  color: #333;
}

button:hover {
  background: #f5f5f5 !important;
}
</style>
