<script setup lang="ts">
import { Tab, TabItem } from '@v-md/ui'
import { ref } from 'vue'

const activeTab = ref('vertical1')
</script>

<template>
  <div class="demo-container">
    <div class="demo-wrapper">
      <Tab v-model="activeTab" direction="vertical">
        <TabItem value="vertical1">
          文件
        </TabItem>
        <TabItem value="vertical2">
          编辑
        </TabItem>
        <TabItem value="vertical3">
          视图
        </TabItem>
        <TabItem value="vertical4">
          工具
        </TabItem>
        <TabItem value="vertical5">
          帮助
        </TabItem>
      </Tab>
      <div class="content-area">
        <div class="current-tab">
          当前激活的标签页：{{ activeTab }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 20px;
}

.demo-wrapper {
  display: flex;
  height: 200px;
  overflow: hidden;
  border: 1px solid var(--vmd-color-border);
  border-radius: 4px;
}

.content-area {
  flex: 1;
  padding: 16px;
  background-color: var(--vmd-color-bg-primary);
}

.current-tab {
  padding: 8px 12px;
  font-size: 14px;
  color: var(--vmd-color-text-primary);
  background-color: var(--vmd-color-bg-secondary);
  border-radius: 4px;
}
</style>
