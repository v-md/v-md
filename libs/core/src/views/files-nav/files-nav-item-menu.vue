<script setup lang="ts">
import type { FileNavMenuConfirmOptions, FileNode } from '../../modules-o/file'
import { reactive, ref } from 'vue'
import { Tippy } from 'vue-tippy'

const props = withDefaults(
  defineProps<{
  /** 文件对象 */
    file: FileNode
  }>(),
  {},
)

const {
  view,
} = props.file

const {
  menuEl,
  menuItems,
  confirmEl,
} = view

const confirmOptions = reactive<Required<FileNavMenuConfirmOptions>>({
  message: '',
  confirmLabel: '',
  cancelLabel: '',
  onConfirm: () => {},
  onCancel: () => {},
})

function confirmHandler(options?: FileNavMenuConfirmOptions) {
  const opts = {
    ...defaultConfirmOptions(),
    ...options,
  }
  Object.assign(confirmOptions, opts)
  confirmEl.value?.show()
}

function defaultConfirmOptions(): Required<FileNavMenuConfirmOptions> {
  return {
    message: '确认删除？',
    confirmLabel: '是',
    cancelLabel: '否',
    onConfirm: () => { confirmEl.value?.hide() },
    onCancel: () => { confirmEl.value?.hide() },
  }
}

view.showConfirm = confirmHandler

const contextMenuEl = ref<HTMLUListElement>()

function showHandler() {
  if (!contextMenuEl.value) {
    return
  }

  const target = contextMenuEl.value.parentElement?.parentElement
  if (target) {
    target.style.padding = '0'
  }
}
</script>

<template>
  <Tippy
    ref="menuEl"
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
        <template v-for="(item, index) in menuItems" :key="index">
          <div v-if="typeof item === 'string'" class="vmd-context-menu-split" />
          <li
            v-else
            class="vmd-context-menu-item"
            @click.stop="item.onTrigger?.(file)"
            @contextmenu.prevent.stop>
            <span>{{ item.label }}</span>
            <span v-if="item.keyboard?.length && item.keyboardLabel">{{ item.keyboardLabel }}</span>
          </li>
        </template>
      </ul>
    </template>
  </Tippy>
  <Tippy
    ref="confirmEl"
    placement="bottom-end"
    trigger="manual"
    interactive
    theme="light"
    to="parent">
    <template #content>
      <div class="vmd-nav-confirm">
        <div class="vmd-nav-confirm-tip" v-html="confirmOptions.message" />
        <div class="vmd-nav-confirm-operations">
          <button class="btn-cancel" @click.stop="confirmOptions.onCancel()">
            {{ confirmOptions.cancelLabel }}
          </button>
          <button class="btn-confirm" @click.stop="confirmOptions.onConfirm()">
            {{ confirmOptions.confirmLabel }}
          </button>
        </div>
      </div>
    </template>
  </Tippy>
</template>

<style lang="scss">
.vmd-file-contextmenu {
  padding: 4px 0 !important;
  overflow-y: auto;
  user-select: none;
}

.vmd-context-menu-split {
  height: 1px;
  margin: 4px 0;
  background-color: var(--vmd-border-color);
}

.vmd-context-menu-item {
  display: flex;
  justify-content: space-between;
  width: 200px;
  padding: 4px 16px;
  font-size: 12px;
  list-style: none;
  cursor: pointer;

  &:hover {
    background-color: var(--vmd-active-color-light);
  }
}

.vmd-nav-confirm {
  width: 200px;
}

.vmd-nav-confirm-tip {
  margin-top: 4px !important;
  margin-bottom: 8px !important;
}

.vmd-nav-confirm-operations {
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
