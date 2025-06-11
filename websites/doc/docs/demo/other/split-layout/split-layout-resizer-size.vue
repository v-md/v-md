<script setup lang="ts">
import { SplitLayout, SplitLayoutItem, SplitLayoutResizer } from '@v-md/ui'
</script>

<template>
  <div style="height: 300px; border: 1px solid #ddd;">
    <SplitLayout>
      <SplitLayoutItem size="30%">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
          <h3>面板 1</h3>
        </div>
      </SplitLayoutItem>
      <SplitLayoutResizer size="8px" />
      <SplitLayoutItem size="40%">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #e8f4fd;">
          <h3>面板 2</h3>
        </div>
      </SplitLayoutItem>
      <SplitLayoutResizer size="2px" />
      <SplitLayoutItem size="30%">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #fff2e8;">
          <h3>面板 3</h3>
        </div>
      </SplitLayoutItem>
    </SplitLayout>
  </div>
  <p style="margin-top: 10px; font-size: 14px; color: #666;">
    第一个分割线宽度为 8px，第二个分割线宽度为 2px
  </p>
</template>

<style scoped>
h3 {
  margin: 0;
  color: #333;
}
</style>
