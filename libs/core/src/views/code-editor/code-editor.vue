<script setup lang="ts">
import { onMounted } from 'vue'
import { Editor } from '../../modules-o/editor'

defineOptions({ name: 'CodeEditor' })

const editor = Editor.use()
const { monaco } = editor
const {
  editorRef,
  editorVisible,
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
  <div v-show="editorVisible" ref="editorRef" class="vmd-code-editor" />
</template>
