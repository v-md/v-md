<script setup lang="ts">
import { SplitLayout, SplitLayoutItem, SplitLayoutResizer } from '@v-md/ui'
</script>

<template>
  <div style="height: 300px; border: 1px solid #ddd;">
    <SplitLayout>
      <SplitLayoutItem size="50%" min-size="20%">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
          <h3>左侧面板 (最小 20%)</h3>
        </div>
      </SplitLayoutItem>
      <SplitLayoutResizer />
      <SplitLayoutItem size="50%" min-size="30%">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #e8f4fd;">
          <h3>右侧面板 (最小 30%)</h3>
        </div>
      </SplitLayoutItem>
    </SplitLayout>
  </div>
</template>

<style scoped>
h3 {
  margin: 0;
  color: #333;
}
</style>
