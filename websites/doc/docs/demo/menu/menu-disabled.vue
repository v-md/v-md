<script setup lang="ts">
import { Menu, MenuItem } from '@v-md/ui'
</script>

<template>
  <div>
    <Menu style="width: 200px;">
      <MenuItem label="普通菜单项" />
      <MenuItem
        label="禁用菜单项"
        disabled
        :icon="{
          url: '/icons/file.svg',
        }"
        key-binding="Ctrl+D" />
      <MenuItem label="另一个普通项" />
      <MenuItem split />
      <MenuItem
        label="禁用的子菜单"
        disabled
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
/* 禁用菜单项示例样式 */
</style>
