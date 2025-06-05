<script setup lang="ts">
import { Menu, MenuItem } from '@v-md/ui'
</script>

<template>
  <div>
    <Menu style="width: 200px;">
      <MenuItem label="aaa" />
      <MenuItem
        label="bbb-hover"
        key-binding="Ctrl+B"
        collapse-icon
        collapse-trigger="hover">
        <Menu style="width: 200px;">
          <MenuItem label="bbb-1" />
          <MenuItem label="bbb-2" />
        </Menu>
      </MenuItem>
      <MenuItem label="ccc" />
    </Menu>
  </div>
</template>

<style scoped>
</style>
