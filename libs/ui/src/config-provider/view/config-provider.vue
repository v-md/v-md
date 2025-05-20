<script setup lang="ts">
import type { ConfigProviderProps } from '../types/config-provider'
import { useDefaultPropsProvide } from '../composables/default-props'
import { useNamespaceProvide } from '../composables/namespace'

const props = defineProps<ConfigProviderProps>()

useNamespaceProvide(props)
useDefaultPropsProvide(props)
</script>

<template>
  <slot />
</template>
