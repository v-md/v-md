<script setup lang="ts">
import { Tab, TabItem } from '@v-md/ui'
import { ref } from 'vue'

const activeTab = ref('tab1')
</script>

<template>
  <div class="demo-container">
    <Tab v-model="activeTab">
      <TabItem value="tab1">
        首页
      </TabItem>
      <TabItem value="tab2">
        产品
      </TabItem>
      <TabItem value="tab3">
        关于我们
      </TabItem>
      <TabItem value="tab4">
        联系我们
      </TabItem>
    </Tab>
    <div class="current-tab">
      当前激活的标签页：{{ activeTab }}
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 20px;
}

.current-tab {
  padding: 8px 12px;
  margin-top: 16px;
  font-size: 14px;
  color: var(--vmd-color-text-primary);
  background-color: var(--vmd-color-bg-secondary);
  border-radius: 4px;
}
</style>
