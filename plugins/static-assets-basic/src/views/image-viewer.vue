<script setup lang="ts">
import { Editor } from '@v-md/core'
import { computed } from 'vue'

const { files } = Editor.use()
const { currentFile } = files

const imgSrc = computed(() => currentFile.value?.content.value || '')
</script>

<template>
  <div class="vmd-image-viewer">
    <img class="vmd-image-preview" :src="imgSrc">
  </div>
</template>

<style lang="scss">
.vmd-image-viewer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.vmd-image-preview {
  max-width: 100%;
}
</style>
