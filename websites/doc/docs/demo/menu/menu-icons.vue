<script setup lang="ts">
import { Menu, MenuItem } from '@v-md/ui'
</script>

<template>
  <div>
    <Menu style="width: 250px;">
      <MenuItem
        label="新建文件"
        :icon="{
          url: '/icons/file.svg',
        }"
        key-binding="Ctrl+N" />
      <MenuItem
        label="打开文件"
        :icon="{
          url: '/icons/file.svg',
        }"
        key-binding="Ctrl+O" />
      <MenuItem split />
      <MenuItem
        label="保存"
        :icon="{
          url: '/icons/file.svg',
        }"
        key-binding="Ctrl+S" />
      <MenuItem
        label="另存为"
        :icon="{
          url: '/icons/file.svg',
        }"
        key-binding="Ctrl+Shift+S" />
      <MenuItem split />
      <MenuItem
        label="最近文件"
        :icon="{
          url: '/icons/file.svg',
        }"
        collapse-icon
        collapse-trigger="hover">
        <Menu style="width: 200px;">
          <MenuItem label="文件1.txt" key-binding="1" />
          <MenuItem label="文件2.md" key-binding="2" />
          <MenuItem label="文件3.js" key-binding="3" />
        </Menu>
      </MenuItem>
      <MenuItem split />
      <MenuItem
        label="退出"
        :icon="{
          url: '/icons/file.svg',
        }"
        key-binding="Alt+F4" />
    </Menu>
  </div>
</template>

<style scoped>
/* 图标和快捷键示例样式 */
</style>
