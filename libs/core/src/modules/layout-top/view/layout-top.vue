<script setup lang="ts">
import type { LayoutTop } from '../model/layout-top'
import { EDITOR_MODEL_NAMES } from '../../editor/utils/model-names'
import { useEditor } from '../../editor/utils/use'

const editor = useEditor()
const layoutTop = editor.getModel<LayoutTop>(EDITOR_MODEL_NAMES.LAYOUT_TOP)
layoutTop.setup()
</script>

<template>
  <div>contents</div>
</template>

<style scoped lang="scss">
</style>
