<script setup lang="ts">
import { Preview } from '../preview'
import { Toolbar } from '../toolbar'
</script>

<template>
  <div class="vmd-preview-view">
    <Toolbar type="preview" />
    <div class="vmd-preview-wrapper">
      <Preview />
    </div>
  </div>
</template>

<style lang="scss">
.vmd-preview-view {
  display: flex;
  flex-direction: column;
  height: 100%;

  .vmd-toolbar {
    flex-shrink: 0;
  }
}

.vmd-preview-wrapper {
  flex: 1;
  height: 0;
}
</style>
