<script setup lang="ts">
import { Tab, TabItem } from '@v-md/ui'
import { ref } from 'vue'

const activeTab1 = ref('gap1')
const activeTab2 = ref('gap1')
const activeTab3 = ref('gap1')
</script>

<template>
  <div class="demo-container">
    <div class="demo-section">
      <h4>无间隙 (gap=0)</h4>
      <Tab v-model="activeTab1" :gap="0">
        <TabItem value="gap1">
          标签一
        </TabItem>
        <TabItem value="gap2">
          标签二
        </TabItem>
        <TabItem value="gap3">
          标签三
        </TabItem>
      </Tab>
    </div>

    <div class="demo-section">
      <h4>中等间隙 (gap=8)</h4>
      <Tab v-model="activeTab2" :gap="8">
        <TabItem value="gap1">
          标签一
        </TabItem>
        <TabItem value="gap2">
          标签二
        </TabItem>
        <TabItem value="gap3">
          标签三
        </TabItem>
      </Tab>
    </div>

    <div class="demo-section">
      <h4>较大间隙 (gap="16px")</h4>
      <Tab v-model="activeTab3" gap="16px">
        <TabItem value="gap1">
          标签一
        </TabItem>
        <TabItem value="gap2">
          标签二
        </TabItem>
        <TabItem value="gap3">
          标签三
        </TabItem>
      </Tab>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 20px;
}

.demo-section {
  margin-bottom: 24px;
}

.demo-section h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vmd-color-text-primary);
}
</style>
