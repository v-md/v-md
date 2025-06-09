<script setup lang="ts">
import { Menu, MenuItem } from '@v-md/ui'
</script>

<template>
  <div>
    <Menu style="width: 200px;">
      <MenuItem
        label="新建文件"
        :icon="{
          url: '/icons/file.svg',
        }"
        key-binding="Ctrl+N" />
      <MenuItem label="打开文件" key-binding="Ctrl+O" />
      <MenuItem split />
      <MenuItem label="长文本菜单项展示截断效果测试" />
      <MenuItem label="退出" key-binding="Alt+F4" />
    </Menu>
  </div>
</template>

<style scoped>
/* 基础菜单示例样式 */
</style>
