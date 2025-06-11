<script setup lang="ts">
import { SplitLayout, SplitLayoutItem, SplitLayoutResizer } from '@v-md/ui'
</script>

<template>
  <div style="height: 300px; border: 1px solid #ddd;">
    <SplitLayout>
      <SplitLayoutItem :size="200">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
          <h3>固定宽度 (200px)</h3>
        </div>
      </SplitLayoutItem>
      <SplitLayoutResizer />
      <SplitLayoutItem>
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #e8f4fd;">
          <h3>自动分配剩余空间</h3>
        </div>
      </SplitLayoutItem>
    </SplitLayout>
  </div>
  <p style="margin-top: 10px; font-size: 14px; color: #666;">
    左侧面板固定 200px，右侧面板自动分配剩余空间
  </p>

  <div style="height: 300px; margin-top: 20px; border: 1px solid #ddd;">
    <SplitLayout>
      <SplitLayoutItem size="25%">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f0f9ff;">
          <h3>25% 固定</h3>
        </div>
      </SplitLayoutItem>
      <SplitLayoutResizer />
      <SplitLayoutItem>
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #fef3c7;">
          <h3>自动分配 1</h3>
        </div>
      </SplitLayoutItem>
      <SplitLayoutResizer />
      <SplitLayoutItem size="150">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #fee2e2;">
          <h3>150px 固定</h3>
        </div>
      </SplitLayoutItem>
      <SplitLayoutResizer />
      <SplitLayoutItem>
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f3e8ff;">
          <h3>自动分配 2</h3>
        </div>
      </SplitLayoutItem>
    </SplitLayout>
  </div>
  <p style="margin-top: 10px; font-size: 14px; color: #666;">
    混合使用：25% 固定 + 自动分配 + 150px 固定 + 自动分配，剩余空间由自动分配的面板平分
  </p>
</template>

<style scoped>
h3 {
  margin: 0;
  color: #333;
}
</style>
