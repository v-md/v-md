<script setup lang="ts">
import type { LayoutActivityModel } from '../models'
import {
  SplitLayoutItem,
  SplitLayoutResizer,
  useNamespace,
} from '@v-md/ui'
import { EDITOR_MODEL_NAMES, useEditor } from '../../editor'

const editor = useEditor()
const layoutActivity = editor.getModel<LayoutActivityModel>(EDITOR_MODEL_NAMES.LAYOUT_ACTIVITY)
layoutActivity.setup()

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('layout-side-main', ...names)
}

const {
  sideMainEl,
} = layoutActivity
</script>

<template>
  <SplitLayoutItem
    ref="sideMainEl"
    :class="c()"
    v-bind="$attrs"
    size="300"
    min-size="200" />
  <SplitLayoutResizer :class="c('border')" size="1" />
</template>

<style lang="scss">
@use "../styles/layout-side-main";
</style>
