<script setup lang="ts">
import type { LayoutTopModel } from '../models'
import { useNamespace } from '@v-md/ui'
import { EDITOR_MODEL_NAMES, useEditor } from '../../editor'
import { SlotsView } from '../../slot'

const editor = useEditor()
const layoutTop = editor.getModel<LayoutTopModel>(EDITOR_MODEL_NAMES.LAYOUT_TOP)
layoutTop.setup()

const {
  left: leftSlot,
  right: rightSlot,
  center: centerSlot,
} = layoutTop.slots

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('layout-top', ...names)
}
</script>

<template>
  <div :class="c()">
    <div :class="c('left')">
      <SlotsView :data="leftSlot" />
    </div>
    <div :class="c('center')">
      <SlotsView :data="centerSlot" />
    </div>
    <div :class="c('right')">
      <SlotsView :data="rightSlot" />
    </div>
  </div>
</template>

<style lang="scss">
@use "../styles/layout-top";
</style>
