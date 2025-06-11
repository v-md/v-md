<script setup lang="ts">
import { SplitLayout, SplitLayoutItem, SplitLayoutResizer } from '@v-md/ui'
</script>

<template>
  <div style="height: 300px; border: 1px solid #ddd;">
    <SplitLayout>
      <SplitLayoutItem size="50%" max-size="70%">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
          <h3>左侧面板 (最大 70%)</h3>
        </div>
      </SplitLayoutItem>
      <SplitLayoutResizer />
      <SplitLayoutItem size="50%" max-size="60%">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #e8f4fd;">
          <h3>右侧面板 (最大 60%)</h3>
        </div>
      </SplitLayoutItem>
    </SplitLayout>
  </div>
  <p style="margin-top: 10px; font-size: 14px; color: #666;">
    使用百分比单位设置最大大小，左侧面板最大 70%，右侧面板最大 60%
  </p>

  <div style="height: 300px; margin-top: 20px; border: 1px solid #ddd;">
    <SplitLayout>
      <SplitLayoutItem size="200px" max-size="400px">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #fff2e8;">
          <h3>左侧面板 (最大 400px)</h3>
        </div>
      </SplitLayoutItem>
      <SplitLayoutResizer />
      <SplitLayoutItem size="50%" max-size="300px">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f0f9ff;">
          <h3>右侧面板 (最大 300px)</h3>
        </div>
      </SplitLayoutItem>
    </SplitLayout>
  </div>
  <p style="margin-top: 10px; font-size: 14px; color: #666;">
    使用像素单位设置最大大小，左侧面板最大 400px，右侧面板最大 300px
  </p>
</template>

<style scoped>
h3 {
  margin: 0;
  color: #333;
}
</style>
