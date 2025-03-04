<script setup lang="ts">
import type { ToolbarItemOptions } from '../../modules/toolbar'
import {
  computed,
  ref,
} from 'vue'
import { Tippy } from 'vue-tippy'
import iMenudown from '../../assets/icons/menu-down.svg'
import { Editor } from '../../modules/editor'
import ToolbarItemIcon from './toolbar-item-icon.vue'

const props = withDefaults(
  defineProps<{
    options: ToolbarItemOptions
  }>(),
  {
  },
)

const editor = Editor.use()
const initialValue = props.options.type === 'switch' ? Boolean(props.options.value) : props.options.value
const value = ref<any>(initialValue)

const hasDropDown = computed(() => props.options.type === 'select' || props.options.type === 'submenu')
const tippyTheme = computed(() => hasDropDown.value ? 'light' : '')
const tippyPlacement = computed(() => hasDropDown.value ? 'bottom-start' : 'top')
const dropdownOptions = computed(() => props.options.options || [])

let dropdownSelectedEl: HTMLElement | null = null
const dropdownMenuRef = ref<HTMLUListElement>()
function showHandler() {
  // 分割线返回 false，不展示 tippy
  if (props.options.type === 'split') {
    return false
  }

  if (!dropdownMenuRef.value) {
    return
  }

  const target = dropdownMenuRef.value.parentElement?.parentElement
  if (target) {
    target.style.padding = '0'
  }

  const timer = setTimeout(() => {
    if (dropdownSelectedEl && props.options.type === 'select') {
      dropdownSelectedEl.scrollIntoView()
    }
    clearTimeout(timer)
  }, 0)
}

function dropdownItemClickHandler(e: MouseEvent, val: any, hideHandler: () => void) {
  dropdownSelectedEl = e.target as HTMLElement
  value.value = val
  props.options.onTrigger?.(editor, val)
  hideHandler()
}

function clickHandler() {
  if (hasDropDown.value || props.options.type === 'split') {
    return
  }

  if (props.options.type === 'switch') {
    value.value = !value.value
  }

  props.options.onTrigger?.(editor, value.value)
}
</script>

<template>
  <Tippy
    :theme="tippyTheme"
    :placement="tippyPlacement"
    :interactive="hasDropDown"
    max-width="none"
    :arrow="!hasDropDown"
    @show="showHandler">
    <template v-if="!hasDropDown" #content>
      {{ options.tip }}
    </template>
    <template
      v-else-if="options.type !== 'split'"
      #content="{ hide }">
      <ul ref="dropdownMenuRef" class="vmd-dropdown-menu">
        <li v-if="options.tip" class="vmd-toolbar-item-tip">
          {{ options.tip }}
        </li>
        <template
          v-for="option in dropdownOptions"
          :key="option.value">
          <li
            v-if="option.html"
            class="vmd-toolbar-item"
            :class="{ 'is-selected': options.type === 'select' && value === option.value }"
            @click="(e) => dropdownItemClickHandler(e, option.value, hide)"
            v-html="option.html" />
          <li
            v-else
            class="vmd-dropdown-item"
            :class="{ 'is-selected': options.type === 'select' && value === option.value }"
            @click="(e) => dropdownItemClickHandler(e, option.value, hide)">
            <ToolbarItemIcon v-if="option.icon" :icon-type="option.iconType" :icon="option.icon" />
            <span v-if="option.label">{{ option.label }}</span>
          </li>
        </template>
      </ul>
    </template>
    <li v-if="options.type === 'split'" class="vmd-toolbar-split" />
    <li
      v-else-if="options.html"
      class="vmd-toolbar-item"
      :class="{ 'is-active': options.type === 'switch' && value }"
      @click="clickHandler"
      v-html="options.html" />
    <li
      v-else
      class="vmd-toolbar-item"
      :class="{ 'is-active': options.type === 'switch' && value }"
      @click="clickHandler">
      <ToolbarItemIcon v-if="options.icon" :icon-type="options.iconType" :icon="options.icon" />
      <span v-if="options.text">{{ options.text }}</span>
      <ToolbarItemIcon v-if="hasDropDown && options.showArrow" :icon="iMenudown" />
    </li>
  </Tippy>
</template>

<style lang="scss">
.vmd-toolbar-item {
  display: flex;
  gap: 2px;
  align-items: center;
  padding: 4px;
  margin: 4px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: var(--vmd-active-color);
  }

  &.is-active {
    color: var(--vmd-primary-color);
  }
}

.vmd-toolbar-split {
  width: 1px;
  height: 18px;
  margin: 0 4px;
  background-color: var(--vmd-border-color);
}

.vmd-dropdown-menu {
  min-width: 100px;
  max-width: 250px;
  max-height: 200px;
  padding: 8px 0 !important;
  overflow-y: auto;
}

.vmd-dropdown-item {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 8px;
  list-style: none;
  cursor: pointer;

  &:hover {
    background-color: var(--vmd-active-color-light);
  }

  &.is-selected {
    color: var(--vmd-primary-color);
  }
}

.vmd-toolbar-item-tip {
  padding: 0 8px 4px;
  border-bottom: 1px solid var(--vmd-border-color);
}

.vmd-dropdown-item-text {
  display: flex;
  gap: 4px;
  align-items: center;
}
</style>
