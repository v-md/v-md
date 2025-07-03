<script setup lang="ts">
import { Icon, MenuItem, Tab, TabItem } from '@v-md/ui'
import { ref } from 'vue'

const activeTab1 = ref('collapse1')
const activeTab2 = ref('collapse1')
</script>

<template>
  <div class="demo-container">
    <div class="demo-section">
      <h4>启用折叠功能（默认）</h4>
      <div class="narrow-container">
        <Tab
          v-model="activeTab1"
          class="demo-collapse-tab"
          :gap="4"
          :collapse-style="{ display: 'flex' }">
          <TabItem value="collapse1">
            标签页一
            <template #collapse="{ trigger }">
              <MenuItem label="标签页一" @click="trigger" />
            </template>
          </TabItem>
          <TabItem value="collapse2">
            标签页二
            <template #collapse="{ trigger }">
              <MenuItem label="标签页二" @click="trigger" />
            </template>
          </TabItem>
          <TabItem value="collapse3">
            标签页三
            <template #collapse="{ trigger }">
              <MenuItem label="标签页三" @click="trigger" />
            </template>
          </TabItem>
          <TabItem value="collapse4">
            标签页四
            <template #collapse="{ trigger }">
              <MenuItem label="标签页四" @click="trigger" />
            </template>
          </TabItem>
          <TabItem value="collapse5">
            标签页五
            <template #collapse="{ trigger }">
              <MenuItem label="标签页五" @click="trigger" />
            </template>
          </TabItem>
          <TabItem value="collapse6">
            标签页六
            <template #collapse="{ trigger }">
              <MenuItem label="标签页六" @click="trigger" />
            </template>
          </TabItem>
          <TabItem value="collapse7">
            标签页七
            <template #collapse="{ trigger }">
              <MenuItem label="标签页七" @click="trigger" />
            </template>
          </TabItem>
          <TabItem value="collapse8">
            标签页八
            <template #collapse="{ trigger }">
              <MenuItem label="标签页八" @click="trigger" />
            </template>
          </TabItem>

          <template #collapse>
            <Icon url="/icons/dot.svg" />
          </template>
        </Tab>
      </div>
      <div class="status">
        当前激活：{{ activeTab1 }}
      </div>
    </div>

    <!--
    <div class="demo-section">
      <h4>禁用折叠功能</h4>
      <div class="narrow-container">
        <Tab v-model="activeTab2" :gap="4" disable-collapse>
          <TabItem value="collapse1">
            标签页一
          </TabItem>
          <TabItem value="collapse2">
            标签页二
          </TabItem>
          <TabItem value="collapse3">
            标签页三
          </TabItem>
          <TabItem value="collapse4">
            标签页四
          </TabItem>
          <TabItem value="collapse5">
            标签页五
          </TabItem>
          <TabItem value="collapse6">
            标签页六
          </TabItem>
          <TabItem value="collapse7">
            标签页七
          </TabItem>
          <TabItem value="collapse8">
            标签页八
          </TabItem>
        </Tab>
      </div>
      <div class="status">
        当前激活：{{ activeTab2 }}
      </div>
    </div>
    -->

    <div class="tips">
      <p>💡 提示：</p>
      <ul>
        <li>当容器宽度不足时，超出的标签页会自动折叠到下拉菜单中</li>
        <li>可以通过 <code>disableCollapse</code> 属性禁用折叠功能</li>
        <li>使用 <code>collapse</code> 插槽可以自定义折叠按钮的显示内容</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 20px;
}

.demo-section {
  margin-bottom: 32px;
}

.demo-section h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vmd-color-text-primary);
}

.narrow-container {
  width: 300px;
  padding: 8px;
  background-color: var(--vmd-color-bg-secondary);
  border: 1px solid var(--vmd-color-border);
  border-radius: 4px;
}

.status {
  padding: 8px 12px;
  margin-top: 12px;
  font-size: 14px;
  color: var(--vmd-color-text-primary);
  background-color: var(--vmd-color-bg-secondary);
  border-radius: 4px;
}

.tips {
  padding: 16px;
  margin-top: 24px;
  background-color: var(--vmd-color-bg-secondary);
  border-left: 4px solid var(--vmd-color-primary);
  border-radius: 6px;
}

.tips p {
  margin: 0 0 8px;
  font-weight: 500;
  color: var(--vmd-color-text-primary);
}

.tips ul {
  padding-left: 20px;
  margin: 0;
  line-height: 1.6;
  color: var(--vmd-color-text-secondary);
}

.tips code {
  padding: 2px 4px;
  font-size: 12px;
  color: var(--vmd-color-text-primary);
  background-color: var(--vmd-color-bg-tertiary);
  border-radius: 2px;
}

.demo-collapse-tab {
  padding-left: 0;
}
</style>
