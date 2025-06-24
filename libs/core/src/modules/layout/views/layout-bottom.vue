<script setup lang="ts">
import type { LayoutBottomModel } from '../models'
import { useNamespace } from '@v-md/ui'
import { EDITOR_MODEL_NAMES, useEditor } from '../../editor'
import { SlotsView } from '../../slot'

const editor = useEditor()
const layoutBottom = editor.getModel<LayoutBottomModel>(EDITOR_MODEL_NAMES.LAYOUT_BOTTOM)
layoutBottom.setup()

const {
  left: leftSlot,
  right: rightSlot,
} = layoutBottom.slots

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('layout-bottom', ...names)
}
</script>

<template>
  <div :class="c()">
    <div :class="c('left')">
      <SlotsView :data="leftSlot" />
    </div>
    <div :class="c('right')">
      <SlotsView :data="rightSlot" />
    </div>
  </div>
</template>

<style lang="scss">
@use "../styles/layout-bottom";
</style>
