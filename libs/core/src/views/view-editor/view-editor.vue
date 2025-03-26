<script setup lang="ts">
import { computed } from 'vue'
import { Editor } from '../../modules/editor'
import { CodeEditor } from '../code-editor'
import { Toolbar } from '../toolbar'

const editor = Editor.use()
const { currentFile } = editor.files

// 自定义编辑区展示组件
const CustomComp = computed(() => {
  if (!currentFile.value) {
    return null
  }
  if (!currentFile.value.editorComponent.value || currentFile.value.editorComponent.value === 'CodeEditor') {
    return null
  }
  return currentFile.value.editorComponent.value
})

// 展示禁用组件
const disableVisible = computed(() => {
  return currentFile.value?.editorComponent.value === null
})
</script>

<template>
  <div class="vmd-editor-view">
    <Toolbar type="editor" />
    <CodeEditor />
    <component :is="CustomComp" v-if="CustomComp" class="vmd-custom-wrapper" />
    <div v-if="disableVisible" class="vmd-disable-wrapper">
      <i class="vmd-disable-warning-icon" />
      <p class="vmd-disable-warning-txt">
        此文件是二进制文件或使用了不受支持的文本编码，所以无法在文本编辑器中显示。
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@use "../../styles/mixins.scss" as *;

.vmd-editor-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.vmd-toolbar {
  flex-shrink: 0;
}

.vmd-code-editor,
.vmd-custom-wrapper,
.vmd-disable-wrapper {
  flex: 1;
  height: 0;
}

.vmd-disable-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.vmd-disable-warning-icon {
  @include icon;

  font-size: 36px;
  color: var(--vmd-warning-color);

  --vmd-icon: url("../../assets/icons/warning.svg");
}

.vmd-disable-warning-txt {
  margin: 8px 0;
  font-size: 14px;
  text-align: center;
}
</style>
