<script setup lang="ts">
import { SplitLayout, SplitLayoutItem, SplitLayoutResizer } from '@v-md/ui'
import { ref } from 'vue'

const firstResizerRef = ref()
const secondResizerRef = ref()
const currentSizes = ref<number[]>([])

function handleResize(sizes: number[]) {
  currentSizes.value = [...sizes]
}

// 移动第一个分割线
function moveFirstResizer(offset: number) {
  firstResizerRef.value?.move(offset)
}

// 移动第二个分割线
function moveSecondResizer(offset: number) {
  secondResizerRef.value?.move(offset)
}

// 预设的移动操作
function expandLeft() {
  moveFirstResizer(50) // 向右移动 50px，扩大左侧面板
}

function shrinkLeft() {
  moveFirstResizer(-50) // 向左移动 50px，缩小左侧面板
}

function expandMiddle() {
  moveFirstResizer(-30) // 先缩小左侧
  setTimeout(() => {
    moveSecondResizer(30) // 再扩大右侧，让中间面板变大
  }, 100)
}

function shrinkMiddle() {
  moveFirstResizer(30) // 先扩大左侧
  setTimeout(() => {
    moveSecondResizer(-30) // 再缩小右侧，让中间面板变小
  }, 100)
}

function resetLayout() {
  // 通过计算当前大小来重置布局
  if (currentSizes.value.length >= 3) {
    const total = currentSizes.value.reduce((sum, size) => sum + size, 0)
    const target = total / 3 // 平均分配

    const offset1 = target - currentSizes.value[0]
    const offset2 = target - currentSizes.value[1] + target - currentSizes.value[0]

    moveFirstResizer(offset1)
    setTimeout(() => {
      moveSecondResizer(offset2)
    }, 100)
  }
}
</script>

<template>
  <div>
    <div style="height: 300px; border: 1px solid #ddd;">
      <SplitLayout @resize="handleResize">
        <SplitLayoutItem size="200px" min-size="100px" max-size="400px">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
            <h3 style="margin: 0 0 10px;">
              左侧面板
            </h3>
            <div style="font-size: 12px; color: #666; text-align: center;">
              当前: {{ currentSizes[0] ? Math.round(currentSizes[0]) : 200 }}px
            </div>
          </div>
        </SplitLayoutItem>
        <SplitLayoutResizer ref="firstResizerRef" />
        <SplitLayoutItem size="200px" min-size="100px" max-size="400px">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #e8f4fd;">
            <h3 style="margin: 0 0 10px;">
              中间面板
            </h3>
            <div style="font-size: 12px; color: #666; text-align: center;">
              当前: {{ currentSizes[1] ? Math.round(currentSizes[1]) : 200 }}px
            </div>
          </div>
        </SplitLayoutItem>
        <SplitLayoutResizer ref="secondResizerRef" />
        <SplitLayoutItem auto-fill min-size="100px" max-size="400px">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #fff2e8;">
            <h3 style="margin: 0 0 10px;">
              右侧面板
            </h3>
            <div style="font-size: 12px; color: #666; text-align: center;">
              当前: {{ currentSizes[2] ? Math.round(currentSizes[2]) : '计算中' }}px
            </div>
          </div>
        </SplitLayoutItem>
      </SplitLayout>
    </div>

    <div style="margin-top: 15px;">
      <h4 style="margin: 0 0 10px; font-size: 14px; color: #333;">
        编程式控制示例：
      </h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
        <button
          style="padding: 6px 12px; font-size: 12px; cursor: pointer; background: #fff; border: 1px solid #ddd; border-radius: 4px;"
          @click="expandLeft">
          扩大左侧 (+50px)
        </button>
        <button
          style="padding: 6px 12px; font-size: 12px; cursor: pointer; background: #fff; border: 1px solid #ddd; border-radius: 4px;"
          @click="shrinkLeft">
          缩小左侧 (-50px)
        </button>
        <button
          style="padding: 6px 12px; font-size: 12px; cursor: pointer; background: #fff; border: 1px solid #ddd; border-radius: 4px;"
          @click="expandMiddle">
          扩大中间
        </button>
        <button
          style="padding: 6px 12px; font-size: 12px; cursor: pointer; background: #fff; border: 1px solid #ddd; border-radius: 4px;"
          @click="shrinkMiddle">
          缩小中间
        </button>
        <button
          style="padding: 6px 12px; font-size: 12px; color: white; cursor: pointer; background: #409eff; border: 1px solid #409eff; border-radius: 4px;"
          @click="resetLayout">
          重置布局
        </button>
      </div>

      <div style="padding: 12px; background: #f9f9f9; border-radius: 4px;">
        <h5 style="margin: 0 0 8px; font-size: 13px; color: #333;">
          精确移动控制：
        </h5>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
          <button
            style="padding: 4px 8px; font-size: 11px; cursor: pointer; background: #fff; border: 1px solid #ccc; border-radius: 3px;"
            @click="moveFirstResizer(10)">
            第一个分割线 +10px
          </button>
          <button
            style="padding: 4px 8px; font-size: 11px; cursor: pointer; background: #fff; border: 1px solid #ccc; border-radius: 3px;"
            @click="moveFirstResizer(-10)">
            第一个分割线 -10px
          </button>
          <button
            style="padding: 4px 8px; font-size: 11px; cursor: pointer; background: #fff; border: 1px solid #ccc; border-radius: 3px;"
            @click="moveSecondResizer(10)">
            第二个分割线 +10px
          </button>
          <button
            style="padding: 4px 8px; font-size: 11px; cursor: pointer; background: #fff; border: 1px solid #ccc; border-radius: 3px;"
            @click="moveSecondResizer(-10)">
            第二个分割线 -10px
          </button>
        </div>
        <p style="margin: 0; font-size: 12px; line-height: 1.4; color: #666;">
          💡 <strong>提示：</strong>move 方法的 offset 参数表示移动的像素距离，正值向右/下移动，负值向左/上移动。
          移动时会自动处理面板的大小限制，可能产生级联调整效果。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

h4,
h5 {
  margin: 0;
  font-weight: 600;
  color: #333;
}

button:hover {
  opacity: 0.8;
}

button:active {
  transform: translateY(1px);
}
</style>
