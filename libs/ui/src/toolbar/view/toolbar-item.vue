<script setup lang="ts">
import type { ToolbarItemProps } from '../types/toolbar-item'
import { useRenderSlot } from '../../common'
import {
  useDefaultProps,
  useNamespace,
} from '../../config-provider'

const initialProps = withDefaults(
  defineProps<ToolbarItemProps>(),
  {
    split: undefined,
    arrow: undefined,
    active: undefined,
    disabled: undefined,
    tipVisible: undefined,
    dropdownVisible: undefined,
  },
)

const props = useDefaultProps('toolbarItemDefault', initialProps, () => ({
}))

const { c } = useNamespace()

const ToolbarItemDropdown = useRenderSlot(() => props.dropdown)
</script>

<template>
  <li>contents</li>
</template>

<style lang="scss">
@use "../styles/toolbar-item";
</style>
