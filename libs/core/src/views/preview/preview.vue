<script setup lang="ts">
import { onMounted } from 'vue'
import { Editor } from '../../modules-o/editor'

const editor = Editor.use()
const { preview } = editor.files
const {
  viewerRef,
} = preview

preview.setup()

const mountedPromise = new Promise<void>((resolve) => {
  onMounted(() => {
    resolve()
  })
})

Promise.all([
  mountedPromise,
  editor.files.init(),
]).then(() => {
  preview.emit('onMounted')
})
</script>

<template>
  <div
    ref="viewerRef"
    class="vmd-iframe-container" />
</template>

<style lang="scss">
.vmd-iframe-container {
  width: 100%;
  height: 100%;
  border: none;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
