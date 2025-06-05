<script setup lang="ts">
import { Menu, MenuItem } from '@v-md/ui'
</script>

<template>
  <div>
    <Menu style="width: 200px;">
      <MenuItem
        label="aaaa"
        collapse-icon
        :icon="{
          url: '/icons/file.svg',
        }"
        key-binding="Ctrl+A" />
      <MenuItem label="bbb" key-binding="Ctrl+B" />
      <MenuItem split />
      <MenuItem label="ccccccccccccccccccccccccccccc" />
    </Menu>
  </div>
</template>

<style scoped>
</style>
