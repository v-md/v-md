<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  source?: string
}>(), {
  source: '',
})

const MAIN_FILE_NAME = 'App.vue'

const sourceHash = computed(() => {
  const originCode = {
    [MAIN_FILE_NAME]: decodeURIComponent(props.source),
  }
  return btoa(unescape(encodeURIComponent(JSON.stringify(originCode))))
})

function toPlayground() {
  window.open(
    `${window.location.origin}/playground.html#${sourceHash.value}`,
    '_blank',
  )
}

const isCodeShow = ref(false)
</script>

<template>
  <div class="demo-wrapper">
    <ClientOnly>
      <div class="demo-preview vp-raw">
        <slot name="demo" />
      </div>
    </ClientOnly>
    <div class="demo-operations">
      <i class="demo-icon i-play" title="在 Playground 中编辑" @click="toPlayground" />
      <i class="demo-icon i-code" title="查看源代码" @click="isCodeShow = !isCodeShow" />
    </div>
    <div v-if="isCodeShow" class="demo-code-wrapper">
      <slot name="code" />
      <div class="demo-bottom">
        <a
          class="demo-bottom-hide-link"
          href="javascript:;"
          @click="isCodeShow = false">隐藏源代码</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "../styles/mixins.scss" as *;

.demo-wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.demo-preview {
  padding: 20px;
}

.demo-operations {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 16px;
  font-size: 18px;
  color: #909399;
  border-top: 1px solid #dcdfe6;
}

.demo-bottom {
  padding: 16px 0;
  text-align: center;

  .demo-bottom-hide-link {
    text-decoration: none;
    cursor: pointer;
  }
}

.demo-icon {
  @include icon;

  cursor: pointer;

  &.i-play {
    --icon: url("../assets/code-play.svg");
  }

  &.i-code {
    --icon: url("../assets/code.svg");
  }
}

.demo-code-wrapper {
  div[class*="language-"] {
    margin: 0;
  }
}
</style>
