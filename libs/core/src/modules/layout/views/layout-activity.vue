<script setup lang="ts">
import type { LayoutActivityModel } from '../models'
import { Tab, useNamespace } from '@v-md/ui'
import { EDITOR_MODEL_NAMES, useEditor } from '../../editor'
import { SlotsView } from '../../slot'

const editor = useEditor()
const layoutActivity = editor.getModel<LayoutActivityModel>(EDITOR_MODEL_NAMES.LAYOUT_ACTIVITY)
layoutActivity.setup()

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('layout-activity', ...names)
}

const {
  slots,
  sideMainDom,
  currentActivity,
} = layoutActivity

const {
  tab: tabSlot,
} = slots
</script>

<template>
  <div :class="c()">
    <Tab
      v-model="currentActivity"
      direction="vertical"
      :class="[c('top'), c('slot')]"
      :panel-teleport-to="sideMainDom">
      <SlotsView :data="tabSlot" />
    </Tab>
    <div :class="[c('bottom'), c('slot')]">
      22
    </div>
  </div>
</template>

<style lang="scss">
@use "../styles/layout-activity";
</style>
