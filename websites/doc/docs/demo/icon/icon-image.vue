<script setup lang="ts">
import { Icon } from '@v-md/ui'
</script>

<template>
  <div>
    <h3>基本使用</h3>
    <Icon src="/images/arrow-left.png" type="img" />
    <h3>调整大小</h3>
    <Icon src="/images/arrow-left.png" type="img" :style="{ '--vmd-icon-size': '30px' }" />
  </div>
</template>
