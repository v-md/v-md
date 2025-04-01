<script setup lang="ts">
import { Editor } from '@v-md/core'
import { computed } from 'vue'

const { files } = Editor.use()
const { currentFile } = files

const imgSrc = computed({
  get: () => currentFile.value?.content.value || '',
  set: (value) => {
    if (!currentFile.value) {
      return
    }
    currentFile.value.content.value = value
  },
})
</script>

<template>
  <div class="vmd-image-viewer">
    <div class="vmd-image-preview-wrapper">
      <img class="vmd-image-preview" :src="imgSrc">
    </div>
    <div class="vmd-image-content">
      <textarea v-model="imgSrc" class="vmd-image-content-textarea" />
    </div>
  </div>
</template>

<style lang="scss">
.vmd-image-viewer {
  display: flex;
  flex-direction: column;
}

.vmd-image-preview-wrapper {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 0;
  padding: 24px;
}

.vmd-image-preview {
  max-width: 100%;
}

.vmd-image-content {
  flex-shrink: 0;
  height: 20%;
  padding: 16px;
  border-top: 1px solid var(--vmd-border-color);
}

.vmd-image-content-textarea {
  width: 100%;
  height: 100%;
  padding: 8px;
  font-size: 16px;
  resize: none;
  outline: none;
}
</style>
