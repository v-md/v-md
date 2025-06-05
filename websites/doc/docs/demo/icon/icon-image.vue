<script setup lang="ts">
import { Icon } from '@v-md/ui'

function getUrl() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTEzIDlWMy41TDE4LjUgOU02IDJjLTEuMTEgMC0yIC44OS0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjhsLTYtNnoiLz48L3N2Zz4=`)
    }, 2000)
  })
}
</script>

<template>
  <div>
    <h3>基本使用</h3>
    <Icon url="/images/arrow-left.png" type="img" />
    <h3>调整大小</h3>
    <Icon url="/images/arrow-left.png" type="img" :style="{ '--vmd-icon-size': '30px' }" />
    <h3>动态加载(2s 后加载出图像)</h3>
    <Icon type="img" :url="getUrl" />
  </div>
</template>
