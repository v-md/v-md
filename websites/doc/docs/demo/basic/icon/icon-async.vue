<script setup lang="ts">
import { Icon } from '@v-md/ui'
import { computed, ref } from 'vue'

const isLoading = ref(false)

// 异步加载函数示例 - 返回 Promise
function getAsyncSvgIcon() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      // 使用 base64 编码的 SVG 图标 (文档图标)
      resolve(`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTEzIDlWMy41TDE4LjUgOU02IDJjLTEuMTEgMC0yIC44OS0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjhsLTYtNloiLz48L3N2Zz4=`)
    }, 2000)
  })
}

// 异步加载函数示例 - 返回图片
function getAsyncImgIcon() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      // 使用现有的图片资源
      resolve('/images/arrow-left.png')
    }, 1500)
  })
}

// 直接返回 Promise 的示例
function getPromiseIcon() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTE5IDNoLTQuMThDMTQuNC42IDEzLjMgMCAxMiAwUzEwLjQgMC42IDEwLjE4IDNINlY1aDJWNGgzVjNIMTJWNGgzVjVoMlY0aDJWOWgtM1Y3SDEyVjlIOXY0SDd2NWE2IDYgMCAwIDAgMTIgMFY5aDJWM3oiLz48L3N2Zz4=`)
    }, 1000)
  })
}

// 使用 computed 来控制是否开始加载
const promiseIconUrl = computed(() => isLoading.value ? getPromiseIcon : undefined)
const asyncSvgIconUrl = computed(() => isLoading.value ? getAsyncSvgIcon : undefined)
const asyncImgIconUrl = computed(() => isLoading.value ? getAsyncImgIcon : undefined)

function startLoading() {
  isLoading.value = true
}

function resetLoading() {
  isLoading.value = false
}
</script>

<template>
  <div class="demo-icon">
    <div class="demo-controls">
      <button :disabled="isLoading" class="start-btn" @click="startLoading">
        {{ isLoading ? '加载中...' : '开始异步加载' }}
      </button>
      <button :disabled="!isLoading" class="reset-btn" @click="resetLoading">
        重置
      </button>
    </div>

    <div class="icon-list">
      <div class="icon-group">
        <Icon url="/icons/folder.svg" />
        <span>同步加载</span>
      </div>
      <div class="icon-group">
        <Icon :url="promiseIconUrl" />
        <span>{{ isLoading ? 'Promise (1秒后显示)' : '点击按钮开始加载' }}</span>
      </div>
      <div class="icon-group">
        <Icon :url="asyncSvgIconUrl" />
        <span>{{ isLoading ? '异步函数 SVG (2秒后显示)' : '点击按钮开始加载' }}</span>
      </div>
      <div class="icon-group">
        <Icon :url="asyncImgIconUrl" type="img" />
        <span>{{ isLoading ? '异步函数图片 (1.5秒后显示)' : '点击按钮开始加载' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-icon {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.start-btn,
.reset-btn {
  padding: 8px 16px;
  color: var(--vmd-color-text);
  cursor: pointer;
  background: var(--vmd-color-bg-content);
  border: 1px solid var(--vmd-color-border);
  border-radius: 4px;
  transition: all 0.2s;
}

.start-btn:disabled,
.reset-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.start-btn:hover:not(:disabled) {
  color: var(--vmd-color-primary);
  border-color: var(--vmd-color-primary);
}

.reset-btn:hover:not(:disabled) {
  color: var(--vmd-color-warning);
  border-color: var(--vmd-color-warning);
}

.icon-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
}

.icon-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  min-width: 120px;
  text-align: center;
}
</style>
