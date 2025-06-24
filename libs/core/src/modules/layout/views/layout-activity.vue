<script setup lang="ts">
import type { LayoutActivityModel } from '../models'
import { useNamespace } from '@v-md/ui'
import { EDITOR_MODEL_NAMES, useEditor } from '../../editor'
import { SlotsView } from '../../slot'

const editor = useEditor()
const layoutActivity = editor.getModel<LayoutActivityModel>(EDITOR_MODEL_NAMES.LAYOUT_ACTIVITY)
layoutActivity.setup()

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('layout-activity', ...names)
}
</script>

<template>
  <div :class="c()">
    <div :class="c('top')">
      11
    </div>
    <div :class="c('bottom')">
      22
    </div>
  </div>
</template>

<style lang="scss">
@use "../styles/layout-activity";
</style>
