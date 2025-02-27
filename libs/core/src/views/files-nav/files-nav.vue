<script setup lang="ts">
import type { FileNode } from '../../modules/file'
import { useTemplateRef } from 'vue'
import FilesNavItemInput from './files-nav-item-input.vue'
import FilesNavItemMenu from './files-nav-item-menu.vue'
import FilesNavItem from './files-nav-item.vue'

const props = withDefaults(
  defineProps<{
  /** 根目录文件节点 */
    root: FileNode

    /** 是否为根节点 */
    isRoot?: boolean
  }>(),
  {
    isRoot: false,
  },
)

const {
  childFolders,
  childFiles,
  isFolder,
  creatingFolder,
  creatingFile,
} = props.root

const menuRef = useTemplateRef<InstanceType<typeof FilesNavItemMenu>>('menuEl')

function contextMenuHandler(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()

  props.root.onRightClick()

  menuRef.value?.setProps({
    getReferenceClientRect: () => ({
      width: 0,
      height: 0,
      top: e.clientY,
      bottom: e.clientY,
      left: e.clientX,
      right: e.clientX,
    }),
  })

  menuRef.value?.show()
}
</script>

<template>
  <ul
    :class="{
      'vmd-files-nav': isRoot,
      'vmd-files-nav-sub': !isRoot,
    }"
    @click.exact="root.onClick"
    @contextmenu="contextMenuHandler">
    <li v-if="isFolder && creatingFolder" class="vmd-files-nav-creator">
      <i class="arrow-right" />
      <i class="folder-icon" />
      <FilesNavItemInput
        :validate="(v) => root.onCreateValidate(v, true)"
        @confirm="(name, valid) => root.onCreateConfirm(name, true, valid)" />
    </li>
    <FilesNavItem
      v-for="item in childFolders"
      :key="`folder-${item.name.value}`"
      :file="item">
      <FilesNav :root="item" />
    </FilesNavItem>
    <li v-if="isFolder && creatingFile" class="vmd-files-nav-creator">
      <i class="empty-icon" />
      <i class="file-icon" />
      <FilesNavItemInput
        :validate="(v) => root.onCreateValidate(v, false)"
        @confirm="(name, valid) => root.onCreateConfirm(name, false, valid)" />
    </li>
    <FilesNavItem
      v-for="item in childFiles"
      :key="`file-${item.name.value}`"
      :file="item">
      <FilesNav :root="item" />
    </FilesNavItem>
    <FilesNavItemMenu ref="menuEl" :file="root" />
  </ul>
</template>

<style lang="scss">
@use "../../styles/mixins.scss" as *;

.vmd-files-nav {
  overflow-y: auto;
}

.vmd-files-nav-sub {
  padding-left: 8px !important;
}

.vmd-files-nav-creator {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 2px 4px !important;
  cursor: pointer;
  border-radius: 4px;

  i {
    @include icon;

    flex-shrink: 0;
    font-size: 16px;

    &.arrow-right {
      --vmd-icon: url("../../assets/icons/keyboard-arrow-right.svg");
    }

    &.empty-icon {
      color: transparent;
    }

    &.folder-icon {
      --vmd-icon: url("../../assets/icons/folder.svg");
    }

    &.file-icon {
      --vmd-icon: url("../../assets/icons/file.svg");
    }
  }

  span[data-v-tippy] {
    flex-grow: 1;
    width: 0;
  }
}
</style>
