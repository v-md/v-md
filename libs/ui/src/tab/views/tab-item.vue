<script setup lang="ts">
import type { TabItemProps, TabItemSlots } from '../types'
import { TabItemContext } from '../composables'
import { defaultTabItemProps } from '../types'

const props = withDefaults(
  defineProps<TabItemProps>(),
  defaultTabItemProps(),
)

defineSlots<TabItemSlots>()

const context = new TabItemContext(props)
const {
  tab,
  itemEl,
  inMenu,
  isActive,
  isPanelInitialized,
} = context

const {
  menuElDom,
  namespace,
  panelTeleportTo,
} = tab

function c(...names: string[]) {
  return namespace.c('tab', 'item', ...names)
}

function handleClick() {
  context.handleClick()
}
</script>

<template>
  <li
    v-if="!inMenu"
    ref="itemEl"
    :class="[c(), {
      [c('disabled')]: disabled,
      [c('active')]: isActive,
    }]"
    :[context.datasetTemplateKey]="true"
    v-bind="$attrs"
    @click="handleClick">
    <slot />
  </li>
  <Teleport v-if="inMenu" :to="menuElDom">
    <slot name="collapse" :trigger="handleClick" />
  </Teleport>
  <Teleport v-if="panelTeleportTo" :to="panelTeleportTo">
    <div v-if="isPanelInitialized" v-show="isActive" :class="c('panel')">
      <slot name="panel" />
    </div>
  </Teleport>
</template>

<style lang="scss">
@use "../styles/tab-item";
</style>
