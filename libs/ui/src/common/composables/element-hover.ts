import type { Ref } from 'vue'
import {
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'

/**
 * 判断鼠标是否悬停在元素上的组合式函数
 * @param targetRef - 目标元素的引用
 */
export function useElementHover(targetRef: Ref<HTMLElement | null | undefined>) {
  const isHovered = ref(false)

  const handleMouseEnter = () => {
    isHovered.value = true
  }

  const handleMouseLeave = () => {
    isHovered.value = false
  }

  const setup = (element: HTMLElement) => {
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
  }

  const cleanup = (element: HTMLElement) => {
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
  }

  const stop = () => {
    if (targetRef.value) {
      cleanup(targetRef.value)
    }
  }

  watch(targetRef, (el, oldEl) => {
    if (oldEl) {
      cleanup(oldEl)
    }
    if (el) {
      setup(el)
    }
  }, { immediate: true })

  onBeforeUnmount(() => {
    stop()
  })

  return {
    isHovered,
    stop,
  }
}
