<script setup lang="ts">
import { SplitLayout, SplitLayoutItem, SplitLayoutResizer } from '@v-md/ui'
</script>

<template>
  <div style="height: 400px; border: 1px solid #ddd;">
    <SplitLayout direction="vertical">
      <SplitLayoutItem size="50%">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
          <h3>上方面板</h3>
        </div>
      </SplitLayoutItem>
      <SplitLayoutResizer />
      <SplitLayoutItem size="50%">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #e8f4fd;">
          <h3>下方面板</h3>
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
