<script setup lang="ts">
import { SplitLayout, SplitLayoutItem, SplitLayoutResizer } from '@v-md/ui'
import { reactive, ref } from 'vue'

const currentSizes = ref<number[]>([])

function handleResize(sizes: number[]) {
  currentSizes.value = [...sizes]
}

const left = reactive({
  minSize: 100,
  maxSize: 200,
  size: 150,
})

const middle = reactive({
  minSize: 100,
  maxSize: 200,
  size: 150,
})

const right = reactive({
  minSize: 150,
  maxSize: 500,
})
</script>

<template>
  <div>
    <div style="height: 350px; border: 1px solid #ddd;">
      <SplitLayout @resize="handleResize">
        <SplitLayoutItem :size="left.size" :min-size="left.minSize" :max-size="left.maxSize">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
            <h3 style="margin: 0 0 10px;">
              左侧面板
            </h3>
            <div style="font-size: 12px; line-height: 1.4; color: #666; text-align: center;">
              <div>最小: {{ left.minSize }}px</div>
              <div>最大: {{ left.maxSize }}px</div>
              <div style="margin-top: 5px; font-weight: 600;">
                当前: {{ currentSizes[0] ? Math.round(currentSizes[0]) : 200 }}px
              </div>
            </div>
          </div>
        </SplitLayoutItem>
        <SplitLayoutResizer />
        <SplitLayoutItem :size="middle.size" :min-size="middle.minSize" :max-size="middle.maxSize">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #e8f4fd;">
            <h3 style="margin: 0 0 10px;">
              中间面板
            </h3>
            <div style="font-size: 12px; line-height: 1.4; color: #666; text-align: center;">
              <div>最小: {{ middle.minSize }}px</div>
              <div>最大: {{ middle.maxSize }}px</div>
              <div style="margin-top: 5px; font-weight: 600;">
                当前: {{ currentSizes[1] ? Math.round(currentSizes[1]) : 250 }}px
              </div>
            </div>
          </div>
        </SplitLayoutItem>
        <SplitLayoutResizer />
        <SplitLayoutItem auto-fill :min-size="right.minSize" :max-size="right.maxSize">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #fff2e8;">
            <h3 style="margin: 0 0 10px;">
              右侧面板
            </h3>
            <div style="font-size: 12px; line-height: 1.4; color: #666; text-align: center;">
              <div>最小: {{ right.minSize }}px</div>
              <div>最大: {{ right.maxSize }}px</div>
              <div style="margin-top: 5px; font-weight: 600;">
                当前: {{ currentSizes[2] ? Math.round(currentSizes[2]) : 200 }}px
              </div>
            </div>
          </div>
        </SplitLayoutItem>
      </SplitLayout>
    </div>

    <div style=" padding: 15px;margin-top: 15px; background: #f9f9f9; border-radius: 6px;">
      <h4 style="margin: 0 0 10px; font-size: 14px; color: #333;">
        级联拖拽效果说明：
      </h4>
      <ul style=" padding-left: 18px;margin: 0; font-size: 13px; line-height: 1.6; color: #666;">
        <li><strong>向左拖拽第一个分割线：</strong>当中间面板达到 {{ middle.maxSize }}px 最大限制时，继续拖拽会开始放大右侧面板</li>
        <li><strong>向右拖拽第一个分割线：</strong>当中间面板达到 {{ middle.minSize }}px 最小限制时，继续拖拽会开始缩小右侧面板</li>
        <li><strong>向左拖拽第二个分割线：</strong>当中间面板达到 {{ middle.minSize }}px 最小限制时，继续拖拽会开始缩小左侧面板</li>
        <li><strong>向右拖拽第二个分割线：</strong>当中间面板达到 {{ middle.maxSize }}px 最大限制时，继续拖拽会开始放大左侧面板</li>
      </ul>
      <p style="margin: 10px 0 0; font-size: 12px; font-style: italic; color: #999;">
        💡 试着拖拽分割线到极限位置，观察其他面板如何自动调整以满足所有限制条件
      </p>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
</style>
