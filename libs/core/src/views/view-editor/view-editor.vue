<script setup lang="ts">
import { CodeEditor } from '../code-editor'
import { Toolbar } from '../toolbar'
</script>

<template>
  <div class="vmd-editor-view">
    <Toolbar type="editor" />
    <CodeEditor />
  </div>
</template>

<style lang="scss">
.vmd-editor-view {
  display: flex;
  flex-direction: column;
  height: 100%;

  .vmd-toolbar {
    flex-shrink: 0;
  }

  .vmd-code-editor {
    flex: 1;
    height: 0;
  }
}
</style>
