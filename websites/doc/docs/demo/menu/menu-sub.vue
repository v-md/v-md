<script setup lang="ts">
import { Menu, MenuItem } from '@v-md/ui'
</script>

<template>
  <div>
    <Menu style="width: 200px;">
      <MenuItem label="普通菜单项" />
      <MenuItem
        label="编辑"
        key-binding="Ctrl+E"
        :icon="{
          url: '/icons/file.svg',
        }"
        collapse-icon
        collapse-trigger="hover">
        <Menu style="width: 180px;">
          <MenuItem label="复制" key-binding="Ctrl+C" />
          <MenuItem label="粘贴" key-binding="Ctrl+V" />
          <MenuItem split />
          <MenuItem
            label="查找替换"
            collapse-icon
            collapse-trigger="hover">
            <Menu style="width: 160px;">
              <MenuItem label="查找" key-binding="Ctrl+F" />
              <MenuItem label="替换" key-binding="Ctrl+H" />
              <MenuItem label="全局查找" key-binding="Ctrl+Shift+F" />
            </Menu>
          </MenuItem>
        </Menu>
      </MenuItem>
      <MenuItem label="另一个菜单项" />
    </Menu>
  </div>
</template>

<style scoped>
/* 嵌套子菜单示例样式 */
</style>
