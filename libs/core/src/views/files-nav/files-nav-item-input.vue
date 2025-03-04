<script setup lang="ts">
import type { TippyComponent } from 'vue-tippy'
import {
  nextTick,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from 'vue'
import { Tippy } from 'vue-tippy'

const props = withDefaults(
  defineProps<{
    /**
     * 验证方法
     * @param value 当前输入的值
     * @returns 返回字符串则提示错误，返回 true 则验证通过
     */
    validate?: (value: string) => string | true
  }>(),
  {
    validate: () => true as const,
  },
)

const emit = defineEmits<{
  /**
   * 确认输入结果的方法
   * @param value 输入的值
   * @param isValid 是否验证通过
   */
  (e: 'confirm', value: string, isValid: boolean): void
}>()

const modelValue = defineModel<string>({ default: '' })
const tippyRef = useTemplateRef<TippyComponent>('tippyEl')
const inputRef = useTemplateRef<HTMLInputElement>('inputEl')
const errTxt = ref('')

onMounted(() => {
  inputRef.value?.focus()
})

watch(modelValue, (val) => {
  const res = props.validate(val)
  if (typeof res === 'string') {
    errTxt.value = res
    nextTick(() => {
      tippyRef.value?.show()
    })
  }
  else {
    errTxt.value = ''
    tippyRef.value?.hide()
  }
}, { immediate: true })

function confirmHandler() {
  emit('confirm', modelValue.value, !errTxt.value)
}

function enterHandler(e: KeyboardEvent) {
  if (!errTxt.value) {
    const target = e.target as any
    target.blur()
  }
}
</script>

<template>
  <Tippy
    ref="tippyEl"
    placement="bottom"
    trigger="manual"
    max-width="none"
    :content="errTxt">
    <input
      ref="inputEl"
      v-model="modelValue"
      class="vmd-file-name-input"
      @blur="confirmHandler"
      @keyup.enter="enterHandler">
  </Tippy>
</template>

<style lang="scss">
.vmd-file-name-input {
  width: 100%;
  padding: 2px 4px !important;
  outline: 0;
}
</style>
