<script setup lang="ts">
import { SplitLayout, SplitLayoutItem, SplitLayoutResizer } from '@v-md/ui'
</script>

<template>
  <div style="height: 300px; border: 1px solid #ddd;">
    <SplitLayout>
      <SplitLayoutItem auto-fill>
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
          <h3>左侧面板</h3>
        </div>
      </SplitLayoutItem>
      <SplitLayoutResizer />
      <SplitLayoutItem auto-fill>
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #e8f4fd;">
          <h3>右侧面板</h3>
        </div>
      </SplitLayoutItem>
    </SplitLayout>
  </div>
  <p style="margin-top: 10px; font-size: 14px; color: #666;">
    使用 `auto-fill` 属性，两个面板会自动平分可用空间。试着拖拽中间的分割线调整大小。
  </p>
</template>

<style scoped>
h3 {
  margin: 0;
  color: #333;
}
</style>
