<script setup lang="ts">
import { onMounted } from 'vue'
import { Editor } from '../../modules/editor'

const editor = Editor.use()
const { monaco } = editor
const {
  editorRef,
} = monaco

monaco.setup()

const mountedPromise = new Promise<void>((resolve) => {
  onMounted(() => {
    resolve()
  })
})

Promise.all([
  mountedPromise,
  monaco.init(),
]).then(() => {
  monaco.emit('onMounted')
})
</script>

<template>
  <div ref="editorRef" class="vmd-code-editor" />
</template>
