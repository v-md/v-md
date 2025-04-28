<script setup lang="ts">
import { Editor } from '../../modules-o/editor'
import { FilesNav } from '../files-nav'
import { Toolbar } from '../toolbar'

const editor = Editor.use()
const { root } = editor.files
</script>

<template>
  <div class="vmd-files-view">
    <Toolbar type="files" />
    <FilesNav :root="root" is-root />
  </div>
</template>

<style lang="scss">
.vmd-files-view {
  display: flex;
  flex-direction: column;
  height: 100%;

  .vmd-files-nav {
    flex: 1;
    height: 0;
    padding: 8px !important;
  }

  .vmd-toolbar {
    flex-shrink: 0;
  }
}
</style>
