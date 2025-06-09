<script setup lang="ts">
import { Icon } from '@v-md/ui'
</script>

<template>
  <div class="demo-icon">
    <div class="icon-group">
      <Icon url="/images/arrow-left.png" type="img" />
      <span>默认尺寸 (16px)</span>
    </div>
    <div class="icon-group">
      <Icon
        url="/images/arrow-left.png"
        type="img"
        :style="{ '--vmd-icon-size': '12px' }" />
      <span>小尺寸 (12px)</span>
    </div>
    <div class="icon-group">
      <Icon
        url="/images/arrow-left.png"
        type="img"
        :style="{ '--vmd-icon-size': '24px' }" />
      <span>大尺寸 (24px)</span>
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
</style>
