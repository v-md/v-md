<script setup lang="ts">
import { Menu, MenuItem } from '@v-md/ui'
</script>

<template>
  <div>
    <Menu style="width: 200px;">
      <MenuItem label="普通菜单项" />
      <MenuItem
        label="悬停触发子菜单"
        collapse-icon
        collapse-trigger="hover"
        :icon="{
          url: '/icons/file.svg',
        }">
        <Menu style="width: 180px;">
          <MenuItem label="悬停子项1" />
          <MenuItem label="悬停子项2" />
          <MenuItem split />
          <MenuItem label="悬停子项3" />
        </Menu>
      </MenuItem>
      <MenuItem
        label="点击触发子菜单"
        collapse-icon
        collapse-trigger="click"
        key-binding="Ctrl+C">
        <Menu style="width: 180px;">
          <MenuItem label="点击子项1" />
          <MenuItem label="点击子项2" />
        </Menu>
      </MenuItem>
      <MenuItem
        label="无触发（仅显示箭头）"
        collapse-icon
        collapse-trigger="none" />
      <MenuItem label="无箭头菜单项" />
    </Menu>
  </div>
</template>

<style scoped>
/* 触发方式示例样式 */
</style>
