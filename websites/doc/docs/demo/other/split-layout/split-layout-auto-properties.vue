<script setup lang="ts">
import { SplitLayout, SplitLayoutItem, SplitLayoutResizer } from '@v-md/ui'
</script>

<template>
  <div>
    <h4 style="margin-bottom: 10px;">
      auto-fill 属性演示
    </h4>
    <div style="height: 250px; border: 1px solid #ddd;">
      <SplitLayout>
        <SplitLayoutItem size="200px">
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
            <h3>固定面板 (200px)</h3>
          </div>
        </SplitLayoutItem>
        <SplitLayoutResizer />
        <SplitLayoutItem auto-fill>
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #e8f4fd;">
            <h3>自动填充面板</h3>
          </div>
        </SplitLayoutItem>
        <SplitLayoutResizer />
        <SplitLayoutItem auto-fill>
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #fff2e8;">
            <h3>自动填充面板</h3>
          </div>
        </SplitLayoutItem>
      </SplitLayout>
    </div>
    <p style="margin: 10px 0; font-size: 14px; color: #666;">
      左侧面板固定 200px，其余两个面板使用 `auto-fill` 平分剩余空间
    </p>

    <h4 style="margin: 30px 0 10px;">
      auto-adjust 属性演示
    </h4>
    <div style="height: 250px; border: 1px solid #ddd;">
      <SplitLayout>
        <SplitLayoutItem size="50%" auto-adjust>
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f0f9ff;">
            <h3>自动调整面板</h3>
          </div>
        </SplitLayoutItem>
        <SplitLayoutResizer />
        <SplitLayoutItem size="50%" :auto-adjust="false">
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; background: #f5f5f5;">
            <h3>固定比例面板</h3>
          </div>
        </SplitLayoutItem>
      </SplitLayout>
    </div>
    <p style="margin: 10px 0; font-size: 14px; color: #666;">
      左侧面板开启 `auto-adjust`，右侧面板关闭。尝试调整浏览器窗口大小观察差异
    </p>
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
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
</style>
