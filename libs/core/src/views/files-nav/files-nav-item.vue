<script setup lang="ts">
import type { FileNode } from '../../modules/file'
import {
  ref,
  watch,
} from 'vue'
import FilesNavItemInput from './files-nav-item-input.vue'
import FilesNavItemMenu from './files-nav-item-menu.vue'

const props = withDefaults(
  defineProps<{
    /** 文件对象 */
    file: FileNode
  }>(),
  {},
)

const {
  name,
  view,
  isFolder,
  path,
  iconStyles,
} = props.file

const {
  active,
  focus,
  cutting,
  expanded,
  renaming,
} = view

const renameInput = ref('')
watch(renaming, () => {
  if (renaming.value) {
    renameInput.value = name.value
  }
})
</script>

<template>
  <li class="vmd-files-nav-item">
    <div
      class="vmd-files-nav-item-wrapper"
      :class="{
        'is-active': active,
        'is-focus': focus,
        'is-cutting': cutting,
      }"
      :title="path"
      @click.exact="view.onClick"
      @click.ctrl.exact="view.onCtrlClick"
      @contextmenu="view.onRightClick">
      <i
        class="vmd-files-nav-item-icon"
        :class="{
          'arrow-right': isFolder && !expanded,
          'arrow-down': isFolder && expanded,
          'empty-icon': !isFolder,
        }" />
      <i
        class="vmd-files-nav-item-icon"
        :style="iconStyles" />
      <FilesNavItemInput
        v-if="renaming"
        v-model="renameInput"
        :validate="(v) => view.onRenameValidate(v)"
        @confirm="(name, valid) => view.onRenameConfirm(name, valid)" />
      <div v-else class="vmd-files-nav-item-text">
        {{ name }}
      </div>
    </div>
    <slot v-if="isFolder && expanded" />
    <FilesNavItemMenu :file="file" />
  </li>
</template>

<style lang="scss">
@use "../../styles/mixins.scss" as *;

.vmd-files-nav-item-text {
  flex-grow: 1;
  width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}

.vmd-files-nav-item-wrapper {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 2px 4px !important;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: var(--vmd-active-color-light);
  }

  &.is-active {
    background-color: var(--vmd-primary-color-light);

    .vmd-files-nav-item-text {
      color: var(--vmd-primary-color);
    }
  }

  &.is-focus {
    outline: 1px solid var(--vmd-primary-color);
    outline-offset: -1px;
  }

  &.is-cutting {
    opacity: 0.5;
  }

  span[data-v-tippy] {
    flex-grow: 1;
    width: 0;
  }
}

.vmd-files-nav-item-icon {
  @include icon;

  flex-shrink: 0;
  font-size: 16px;

  &.arrow-right {
    --vmd-icon: url("../../assets/icons/keyboard-arrow-right.svg");
  }

  &.arrow-down {
    --vmd-icon: url("../../assets/icons/keyboard-arrow-down.svg");
  }

  &.empty-icon {
    color: transparent;
  }
}
</style>
