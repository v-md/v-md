<script setup lang="ts">
import { Menu, MenuItem } from '@v-md/ui'
</script>

<template>
  <div>
    <h4 style="margin-bottom: 10px;">
      快速响应 (100ms)
    </h4>
    <Menu style="width: 200px; margin-bottom: 20px;" :collapse-delay="100">
      <MenuItem label="普通菜单项" />
      <MenuItem
        label="快速触发子菜单"
        collapse-icon
        collapse-trigger="hover">
        <Menu style="width: 180px;">
          <MenuItem label="子菜单项1" />
          <MenuItem label="子菜单项2" />
        </Menu>
      </MenuItem>
    </Menu>

    <h4 style="margin-bottom: 10px;">
      默认延时 (300ms)
    </h4>
    <Menu style="width: 200px; margin-bottom: 20px;">
      <MenuItem label="普通菜单项" />
      <MenuItem
        label="默认延时子菜单"
        collapse-icon
        collapse-trigger="hover">
        <Menu style="width: 180px;">
          <MenuItem label="子菜单项1" />
          <MenuItem label="子菜单项2" />
        </Menu>
      </MenuItem>
    </Menu>

    <h4 style="margin-bottom: 10px;">
      慢速响应 (800ms)
    </h4>
    <Menu style="width: 200px;" :collapse-delay="800">
      <MenuItem label="普通菜单项" />
      <MenuItem
        label="慢速触发子菜单"
        collapse-icon
        collapse-trigger="hover">
        <Menu style="width: 180px;">
          <MenuItem label="子菜单项1" />
          <MenuItem label="子菜单项2" />
        </Menu>
      </MenuItem>
    </Menu>
  </div>
</template>

<style scoped>
/* 延时配置示例样式 */
h4 {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
</style>
