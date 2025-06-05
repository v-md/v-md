<script setup lang="ts">
import type { IconPropsWithAttrs } from '../../icon'
import type { TippyComponent } from '../../tippy'
import type {
  MenuItemEmits,
  MenuItemProps,
  MenuItemSlots,
} from '../types/menu-item'
import { isObjectLike } from '@v-md/shared'
import {
  computed,
  ref,
  watch,
} from 'vue'
import { useElementHover } from '../../common'
import { useNamespace } from '../../config-provider'
import { Icon } from '../../icon'
import { Tippy } from '../../tippy'
import { MenuItemContext } from '../composables'

const props = defineProps<MenuItemProps>()

const emit = defineEmits<MenuItemEmits>()

defineSlots<MenuItemSlots>()

const { c: className } = useNamespace()

function c(...names: string[]) {
  return className('menu', 'item', ...names)
}

const context = new MenuItemContext(props)
const {
  itemEl,
} = context

const collapseIconProps = computed<IconPropsWithAttrs>(() => {
  if (!props.collapseIcon) {
    return {}
  }
  else if (isObjectLike(props.collapseIcon)) {
    return props.collapseIcon
  }

  return {
    url: () => import('../assets/arrow-right.svg').then(m => m.default),
  }
})

const collapseEnabled = computed(() => props.collapseTrigger && props.collapseTrigger !== 'none')

const linkEl = ref<HTMLAnchorElement>()
const tippyEl = ref<TippyComponent>()
const { isHovered } = useElementHover(linkEl)

watch(isHovered, (val) => {
  if (props.collapseTrigger !== 'hover' || props.disabled) {
    return
  }

  if (val) {
    tippyEl.value?.show()
  }
  else {
    // tippyEl.value?.hide()
  }
})

let clickShowState = false
function clickHandler() {
  console.log('click')
  if (props.collapseTrigger !== 'click' || props.disabled) {
    return
  }

  if (clickShowState) {
    tippyEl.value?.hide()
  }
  else {
    tippyEl.value?.show()
  }

  clickShowState = !clickShowState
}

function unHandler(instance, event) {
  console.log(instance, event)
}

function hideHandler(instance, ...args) {
  console.log(instance, args)
}
</script>

<template>
  <li
    v-if="split"
    v-bind="$attrs"
    :class="c('split')" />
  <li
    v-else
    ref="itemEl"
    data-vmd-menu-item="true"
    v-bind="$attrs"
    :class="[c()]">
    <a ref="linkEl" :class="c('link')" @click="clickHandler">
      <Icon
        v-if="icon"
        :class="[c('icon'), c('label', 'icon')]"
        v-bind="icon" />
      <span :class="c('label')">{{ label }}</span>
      <span
        v-if="keyBinding"
        :class="c('key', 'binding')">{{ keyBinding }}</span>
      <Icon
        v-if="collapseIcon"
        :class="[c('icon'), c('collapse', 'icon')]"
        v-bind="collapseIconProps" />
    </a>
    <Tippy
      v-if="collapseEnabled"
      ref="tippyEl"
      placement="right-start"
      trigger="manual"
      interactive
      :arrow="false"
      :offset="[0, 0]"
      to="parent"
      @hide="hideHandler"
      @untrigger="unHandler">
      <template #content>
        <slot />
      </template>
    </Tippy>
  </li>
</template>

<style lang="scss">
@use "../styles/menu-item";
</style>
