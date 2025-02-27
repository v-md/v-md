<script setup lang="ts">
import type { TippyComponent, TippyOptions } from 'vue-tippy'
import type { FileNode } from '../../modules/file'
import { computed, useTemplateRef } from 'vue'
import { Tippy } from 'vue-tippy'

const props = withDefaults(
  defineProps<{
  /** 文件对象 */
    file: FileNode
  }>(),
  {},
)

const {
  name,
  isFolder,
  keyType,
} = props.file

const tippyRef = useTemplateRef<TippyComponent>('tippyEl')
const deleteTippyRef = useTemplateRef<TippyComponent>('deleteTippyEl')
const contextMenuRef = useTemplateRef<HTMLUListElement>('contextMenuEl')
const disableRemove = computed(() => Boolean(keyType.value))

function showHandler() {
  if (!contextMenuRef.value) {
    return
  }

  const target = contextMenuRef.value.parentElement?.parentElement
  if (target) {
    target.style.padding = '0'
  }
}

function show() {
  tippyRef.value?.show()
}

function hide() {
  tippyRef.value?.hide()
}

function setProps(options: TippyOptions) {
  tippyRef.value?.setProps(options)
}

function createFileHandler() {
  props.file.onCreateFile()
  hide()
}

function createFolderHandler() {
  props.file.onCreateFolder()
  hide()
}

function renameHandler() {
  props.file.onRename()
  hide()
}

function deleteHandler() {
  hide()
  deleteTippyRef.value?.show()
}

function deleteCancelHandler() {
  deleteTippyRef.value?.hide()
}

function deleteConfirmHandler() {
  props.file.onDelete()
  deleteTippyRef.value?.hide()
}

defineExpose({
  show,
  hide,
  setProps,
})
</script>

<template>
  <Tippy
    ref="tippyEl"
    placement="bottom-start"
    trigger="manual"
    interactive
    theme="light"
    :arrow="false"
    :offset="[0, 0]"
    to="parent"
    @show="showHandler">
    <template #content>
      <ul ref="contextMenuEl" class="vmd-file-contextmenu">
        <li v-if="isFolder" class="vmd-context-menu-item" @click.stop="createFileHandler">
          新建文件
        </li>
        <li v-if="isFolder" class="vmd-context-menu-item" @click.stop="createFolderHandler">
          新建目录
        </li>
        <li v-if="!disableRemove" class="vmd-context-menu-item">
          剪切
        </li>
        <li class="vmd-context-menu-item">
          复制
        </li>
        <li v-if="isFolder" class="vmd-context-menu-item">
          粘贴
        </li>
        <li v-if="!disableRemove" class="vmd-context-menu-item" @click.stop="deleteHandler">
          删除
        </li>
        <li v-if="!disableRemove" class="vmd-context-menu-item" @click.stop="renameHandler">
          重命名
        </li>
      </ul>
    </template>
  </Tippy>
  <Tippy
    ref="deleteTippyEl"
    placement="bottom-end"
    trigger="manual"
    interactive
    theme="light"
    to="parent">
    <template #content>
      <div class="vmd-nav-delete">
        <p class="vmd-nav-delete-tip">
          是否删除{{ isFolder ? '目录' : '文件' }}：{{ name }}？删除后不可恢复。
        </p>
        <div class="vmd-nav-delete-operations">
          <button class="btn-cancel" @click.stop="deleteCancelHandler">
            否
          </button>
          <button class="btn-confirm" @click.stop="deleteConfirmHandler">
            是
          </button>
        </div>
      </div>
    </template>
  </Tippy>
</template>

<style lang="scss">
.vmd-file-contextmenu {
  min-width: 100px;
  max-width: 250px;
  padding: 4px 0 !important;
  overflow-y: auto;
}

.vmd-context-menu-item {
  padding: 4px 8px;
  list-style: none;
  cursor: pointer;

  &:hover {
    background-color: var(--vmd-active-color-light);
  }
}

.vmd-nav-delete {
  width: 200px;
}

.vmd-nav-delete-tip {
  margin-top: 4px !important;
  margin-bottom: 8px !important;
}

.vmd-nav-delete-operations {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 4px 8px;

  .btn-confirm,
  .btn-cancel {
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 4px;
  }

  .btn-confirm {
    color: #fff;
    background-color: var(--vmd-primary-color);
    border: none;
  }

  .btn-cancel {
    background-color: transparent;
    border: 1px solid var(--vmd-border-color);
  }
}
</style>
