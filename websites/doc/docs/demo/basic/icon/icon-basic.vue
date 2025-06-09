<script setup lang="ts">
import { Icon } from '@v-md/ui'
</script>

<template>
  <div class="demo-icon">
    <div class="icon-group">
      <Icon url="/icons/folder.svg" />
      <span>默认颜色</span>
    </div>
    <div class="icon-group primary">
      <Icon url="/icons/folder.svg" />
      <span>主题色</span>
    </div>
    <div class="icon-group success">
      <Icon url="/icons/file.svg" />
      <span>成功色</span>
    </div>
    <div class="icon-group warning">
      <Icon url="/icons/file.svg" />
      <span>警告色</span>
    </div>
    <div class="icon-group danger">
      <Icon url="/icons/folder.svg" />
      <span>危险色</span>
    </div>
  </div>
</template>

<style scoped>
.demo-icon {
  display: flex;
  gap: 24px;
  align-items: center;
}

.icon-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.primary {
  color: var(--vmd-color-primary);
}

.success {
  color: var(--vmd-color-success);
}

.warning {
  color: var(--vmd-color-warning);
}

.danger {
  color: var(--vmd-color-danger);
}
</style>
