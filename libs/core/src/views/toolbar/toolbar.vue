<script setup lang="ts">
import type { ToolbarType } from '../../modules-o/toolbar'
import { Editor } from '../../modules-o/editor'
import ToolbarItem from './toolbar-item.vue'

const props = withDefaults(
  defineProps<{
    type?: ToolbarType
  }>(),
  {
    type: 'editor',
  },
)

const editor = Editor.use()
const toolbar = editor.toolbars[props.type]
const { props: toolbarProps } = toolbar
</script>

<template>
  <ul v-show="toolbarProps.visible" class="vmd-toolbar">
    <ToolbarItem
      v-for="item in toolbarProps.items"
      :key="item.name"
      :options="item" />
  </ul>
</template>

<style lang="scss">
.vmd-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: 1px solid var(--vmd-border-color) !important;
}
</style>
