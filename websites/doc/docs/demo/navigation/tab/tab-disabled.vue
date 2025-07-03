<script setup lang="ts">
import { Tab, TabItem } from '@v-md/ui'
import { ref } from 'vue'

const activeTab = ref('enabled1')
</script>

<template>
  <div class="demo-container">
    <Tab v-model="activeTab" :gap="8">
      <TabItem value="enabled1">
        可用标签
      </TabItem>
      <TabItem value="disabled1" disabled>
        禁用标签
      </TabItem>
      <TabItem value="enabled2">
        可用标签
      </TabItem>
      <TabItem value="disabled2" disabled>
        禁用标签
      </TabItem>
      <TabItem value="enabled3">
        可用标签
      </TabItem>
    </Tab>

    <div class="status-info">
      <div class="current-tab">
        当前激活的标签页：{{ activeTab }}
      </div>
      <div class="tips">
        禁用的标签页无法被点击和选中
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 20px;
}

.status-info {
  margin-top: 16px;
}

.current-tab {
  padding: 8px 12px;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--vmd-color-text-primary);
  background-color: var(--vmd-color-bg-secondary);
  border-radius: 4px;
}

.tips {
  font-size: 12px;
  color: var(--vmd-color-text-secondary);
}
</style>
