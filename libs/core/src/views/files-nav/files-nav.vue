<script setup lang="ts">
import type { FileNode } from '../../modules-o/file'
import { onBeforeUnmount, ref } from 'vue'
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
  view,
} = props.root

const {
  creatingFolder,
  creatingFile,
} = view

const navEl = ref<HTMLElement>()

// 外部点击检测
document.addEventListener('click', outsideClickHandler)
onBeforeUnmount(() => {
  document.removeEventListener('click', outsideClickHandler)
})

function outsideClickHandler(e: MouseEvent) {
  const el = e.target as HTMLElement
  if (!navEl.value) {
    return
  }

  if (!navEl.value.contains(el)) {
    view.managerView.onClickOutside()
  }
}
</script>

<template>
  <ul
    ref="navEl"
    :class="{
      'vmd-files-nav': isRoot,
      'vmd-files-nav-sub': !isRoot,
    }"
    @click.exact="view.onClick"
    @contextmenu="view.onRightClick">
    <li v-if="isFolder && creatingFolder" class="vmd-files-nav-creator">
      <i class="arrow-right" />
      <i class="folder-icon" />
      <FilesNavItemInput
        :validate="(v) => view.onCreateValidate(v, true)"
        @confirm="(name, valid) => view.onCreateConfirm(name, true, valid)" />
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
        :validate="(v) => view.onCreateValidate(v, false)"
        @confirm="(name, valid) => view.onCreateConfirm(name, false, valid)" />
    </li>
    <FilesNavItem
      v-for="item in childFiles"
      :key="`file-${item.name.value}`"
      :file="item" />
    <FilesNavItemMenu v-if="isRoot" :file="root" />
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
