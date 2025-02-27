<script setup lang="ts">
import type { LayoutProps } from './props'
import { useElementSize } from '@vueuse/core'
import {
  computed,
  onBeforeUnmount,
  reactive,
  ref,
} from 'vue'

const props = withDefaults(
  defineProps<LayoutProps>(),
  {
    navWidthRatio: 20,
    navMinWidthRatio: 10,
    navMaxWidthRatio: 50,
    navVisible: true,
    previewWidthRatio: 50,
    previewMinWidthRatio: 20,
    previewMaxWidthRatio: 60,
    previewVisible: true,
  },
)

const layoutRef = ref<HTMLDivElement>()
const { width: layoutWidth } = useElementSize(layoutRef)

const navRatio = ref(props.navWidthRatio)
const navRatioFinal = computed(() => props.navVisible ? navRatio.value : 0)
const navRatioStr = computed(() => `${navRatioFinal.value}%`)

const previewRatio = ref(props.previewWidthRatio)
const previewRatioStr = computed(() => `${previewRatio.value}%`)

const dragState = reactive({
  isDragging: false,
  startX: 0,
  type: '',
})

function dragStartHandler(e: MouseEvent, type: 'nav' | 'preview') {
  dragState.isDragging = true
  dragState.startX = e.x
  dragState.type = type
  removeListeners()
  document.addEventListener('mousemove', dragMoveHandler, true)
  document.addEventListener('mouseup', dragEndHandler, true)
}

function dragMoveHandler(e: MouseEvent) {
  if (!dragState.isDragging) {
    return
  }

  const delta = e.x - dragState.startX

  if (dragState.type === 'nav') {
    const totalWidth = layoutWidth.value
    const curWidth = totalWidth * navRatio.value / 100
    const nextRatio = (curWidth + delta) / totalWidth * 100
    const maxRatio = props.navMaxWidthRatio
    const minRatio = props.navMinWidthRatio

    if (nextRatio < minRatio || nextRatio > maxRatio) {
      return
    }

    navRatio.value = nextRatio
  }
  else {
    const totalWidth = layoutWidth.value * (100 - navRatio.value) / 100
    const curWidth = totalWidth * previewRatio.value / 100
    const nextRatio = (curWidth - delta) / totalWidth * 100
    const maxRatio = props.previewMaxWidthRatio
    const minRatio = props.previewMinWidthRatio

    if (nextRatio < minRatio || nextRatio > maxRatio) {
      return
    }

    previewRatio.value = nextRatio
  }

  dragState.startX = e.x
}

function dragEndHandler() {
  removeListeners()
  dragState.isDragging = false
}

function removeListeners() {
  document.removeEventListener('mousemove', dragMoveHandler, true)
  document.removeEventListener('mouseup', dragEndHandler, true)
}

onBeforeUnmount(() => {
  removeListeners()
})
</script>

<template>
  <div ref="layoutRef" class="vmd-layout">
    <div v-show="navVisible" class="nav-wrapper">
      <slot name="nav" />
      <div class="dragger nav-dragger" @mousedown.prevent="(e) => dragStartHandler(e, 'nav')" />
    </div>
    <div class="content-wrapper">
      <div class="editor-wrapper">
        <slot />
      </div>
      <div class="preview-wrapper">
        <slot name="preview" />
        <div class="dragger preview-dragger" @mousedown.prevent="(e) => dragStartHandler(e, 'preview')" />
        <div v-if="dragState.isDragging" class="preview-cover" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.vmd-layout {
  position: relative;
  display: flex;

  .nav-wrapper {
    position: relative;
    width: v-bind(navRatioStr);
  }

  .dragger {
    position: absolute;
    width: 6px;
    cursor: ew-resize;

    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 1px;
      content: "";
      background-color: var(--vmd-border-color);
      transform: translateX(-50%);
    }
  }

  .nav-dragger {
    position: absolute;
    top: 0;
    right: -3px;
    height: 100%;
  }

  .content-wrapper {
    display: flex;
    flex-grow: 1;
    width: 0;
  }

  .editor-wrapper {
    flex-grow: 1;
    width: 0;
  }

  .preview-wrapper {
    position: relative;
    width: v-bind(previewRatioStr);
  }

  .preview-dragger {
    position: absolute;
    top: 0;
    left: -3px;
    height: 100%;
  }

  .preview-cover {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: transparent;
  }
}
</style>
