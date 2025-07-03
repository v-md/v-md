<script setup lang="ts">
import { Tab, TabItem } from '@v-md/ui'
import { ref } from 'vue'

const activeTab = ref('panel1')
const panelContainer = ref()
</script>

<template>
  <div class="demo-container">
    <div class="tab-panel-demo">
      <div class="tab-header">
        <Tab v-model="activeTab" :panel-teleport-to="panelContainer">
          <TabItem value="panel1">
            用户信息
            <template #panel>
              <div class="panel-content">
                <h3>用户信息</h3>
                <p>这里显示用户的基本信息，包括姓名、邮箱、电话等。</p>
                <div class="user-info">
                  <div class="info-item">
                    <span class="label">姓名：</span>
                    <span class="value">张三</span>
                  </div>
                  <div class="info-item">
                    <span class="label">邮箱：</span>
                    <span class="value">zhangsan@example.com</span>
                  </div>
                  <div class="info-item">
                    <span class="label">电话：</span>
                    <span class="value">138-0000-0000</span>
                  </div>
                </div>
              </div>
            </template>
          </TabItem>
          <TabItem value="panel2">
            系统设置
            <template #panel>
              <div class="panel-content">
                <h3>系统设置</h3>
                <p>这里可以配置系统的各种参数和选项。</p>
                <div class="settings-list">
                  <div class="setting-item">
                    <span class="setting-name">主题模式</span>
                    <span class="setting-value">自动</span>
                  </div>
                  <div class="setting-item">
                    <span class="setting-name">语言</span>
                    <span class="setting-value">中文</span>
                  </div>
                  <div class="setting-item">
                    <span class="setting-name">通知</span>
                    <span class="setting-value">开启</span>
                  </div>
                </div>
              </div>
            </template>
          </TabItem>
          <TabItem value="panel3">
            帮助文档
            <template #panel>
              <div class="panel-content">
                <h3>帮助文档</h3>
                <p>查看产品使用说明和常见问题解答。</p>
                <div class="help-sections">
                  <div class="help-item">
                    📖 快速开始
                  </div>
                  <div class="help-item">
                    🔧 功能介绍
                  </div>
                  <div class="help-item">
                    ❓ 常见问题
                  </div>
                  <div class="help-item">
                    📞 联系支持
                  </div>
                </div>
              </div>
            </template>
          </TabItem>
        </Tab>
      </div>

      <div ref="panelContainer" class="panel-container">
        <!-- 面板内容会被 Teleport 到这里 -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 20px;
}

.tab-panel-demo {
  overflow: hidden;
  border: 1px solid var(--vmd-color-border);
  border-radius: 8px;
}

.tab-header {
  padding: 0 16px;
  background-color: var(--vmd-color-bg-secondary);
  border-bottom: 1px solid var(--vmd-color-border);
}

.panel-container {
  min-height: 200px;
  background-color: var(--vmd-color-bg-primary);
}

.panel-content {
  padding: 20px;
}

.panel-content h3 {
  margin: 0 0 12px;
  font-size: 16px;
  color: var(--vmd-color-text-primary);
}

.panel-content p {
  margin: 0 0 16px;
  line-height: 1.5;
  color: var(--vmd-color-text-secondary);
}

.user-info,
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item,
.setting-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--vmd-color-bg-secondary);
  border-radius: 4px;
}

.label,
.setting-name {
  font-weight: 500;
  color: var(--vmd-color-text-primary);
}

.value,
.setting-value {
  color: var(--vmd-color-text-secondary);
}

.help-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.help-item {
  padding: 12px;
  color: var(--vmd-color-text-primary);
  text-align: center;
  cursor: pointer;
  background-color: var(--vmd-color-bg-secondary);
  border-radius: 6px;
  transition: background-color 0.2s;
}

.help-item:hover {
  background-color: var(--vmd-color-bg-tertiary);
}
</style>
