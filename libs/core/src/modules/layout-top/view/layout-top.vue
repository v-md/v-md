<script setup lang="ts">
import type { LayoutTop } from '../model/layout-top'
import { EDITOR_MODEL_NAMES } from '../../editor/utils/model-names'
import { useEditor } from '../../editor/utils/use'
import SlotsView from '../../slot/view/slots-view.vue'

const editor = useEditor()
const layoutTop = editor.getModel<LayoutTop>(EDITOR_MODEL_NAMES.LAYOUT_TOP)
layoutTop.setup()

const {
  left: leftSlot,
  right: rightSlot,
  center: centerSlot,
} = layoutTop.slots
</script>

<template>
  <div class="vmd-layout-top">
    <SlotsView :data="leftSlot" />
    <SlotsView :data="centerSlot" />
    <SlotsView :data="rightSlot" />
  </div>
</template>

<style lang="scss">
.vmd-layout-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
