<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { MenuContext } from '../../menu'
import type { TabModel, TabProps } from '../types'
import { computed, getCurrentInstance } from 'vue'
import { Menu } from '../../menu'
import { Tippy } from '../../tippy'
import { TabContext } from '../composables'
import { defaultTabProps } from '../types'

const props = withDefaults(
  defineProps<TabProps>(),
  defaultTabProps(),
)

const modelValue = defineModel<TabModel['modelValue']>({
  required: false,
  default: '',
})

const context = new TabContext(props, modelValue)
const {
  namespace,
  containerEl,
  menuEl,
  collapseEl,
  isCollapse,
  tippyPlacement,
  gapSize,
} = context

function c(...names: string[]) {
  return namespace.c('tab', ...names)
}

const styles = computed<CSSProperties>(() => {
  return {
    gap: `${gapSize.value}px`,
  }
})

const collapseClassList = computed(
  () => typeof props.collapseClass === 'string' ?
      [props.collapseClass] :
    props.collapseClass,
)

const instance = getCurrentInstance()
function handleSetup(menuContext: MenuContext) {
  menuContext.setProvide(instance)
}
</script>

<template>
  <ul
    ref="containerEl"
    :class="[c(), c(direction)]"
    :style="styles">
    <slot />
    <Tippy
      v-if="!disableCollapse"
      ref="collapseEl"
      :class="[c('item', 'collapse'), ...collapseClassList, {
        [c('item', 'collapse', 'hidden')]: !isCollapse,
      }]"
      :style="[collapseStyle]"
      :placement="tippyPlacement"
      :trigger="collapseTrigger"
      interactive
      :arrow="false"
      :offset="[0, 0]"
      tag="li">
      <slot name="collapse" />
      <template #content>
        <Menu
          ref="menuEl"
          :class="c('collapse', 'menu')"
          style="width: 180px;"
          @setup="handleSetup" />
      </template>
    </Tippy>
  </ul>
</template>

<style lang="scss">
@use "../styles/tab";
</style>
