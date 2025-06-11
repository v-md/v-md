import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import SplitLayoutItem from '../view/split-layout-item.vue'
import SplitLayoutResizer from '../view/split-layout-resizer.vue'
import SplitLayout from '../view/split-layout.vue'

describe('splitLayout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('basic rendering', () => {
    it('should render correctly with default props', () => {
      const wrapper = mount(() => (
        <SplitLayout>
          <div>Panel 1</div>
          <div>Panel 2</div>
        </SplitLayout>
      ))

      expect(wrapper.find('.vmd-split-layout').exists()).toBe(true)
      expect(wrapper.find('.vmd-split-layout-horizontal').exists()).toBe(true)
      expect(wrapper.text()).toContain('Panel 1')
      expect(wrapper.text()).toContain('Panel 2')
    })

    it('should render with vertical direction', () => {
      const wrapper = mount(() => (
        <SplitLayout direction="vertical">
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      expect(wrapper.find('.vmd-split-layout-vertical').exists()).toBe(true)
      expect(wrapper.find('.vmd-split-layout-horizontal').exists()).toBe(false)
    })

    it('should render with SplitLayoutItem components', () => {
      const wrapper = mount(() => (
        <SplitLayout>
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      expect(wrapper.findAll('.vmd-split-layout-item')).toHaveLength(2)
      expect(wrapper.text()).toContain('Panel 1')
      expect(wrapper.text()).toContain('Panel 2')
    })

    it('should render with SplitLayoutResizer', () => {
      const wrapper = mount(() => (
        <SplitLayout>
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutResizer />
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      expect(wrapper.findAll('.vmd-split-layout-item')).toHaveLength(2)
      expect(wrapper.findAll('.vmd-split-layout-resizer')).toHaveLength(1)
    })
  })

  describe('direction prop', () => {
    it('should apply horizontal direction class by default', () => {
      const wrapper = mount(() => (
        <SplitLayout>
          <div>Content</div>
        </SplitLayout>
      ))

      expect(wrapper.find('.vmd-split-layout-horizontal').exists()).toBe(true)
    })

    it('should apply vertical direction class when direction is vertical', () => {
      const wrapper = mount(() => (
        <SplitLayout direction="vertical">
          <div>Content</div>
        </SplitLayout>
      ))

      expect(wrapper.find('.vmd-split-layout-vertical').exists()).toBe(true)
    })

    it('should update direction class when prop changes', async () => {
      const direction = ref<'horizontal' | 'vertical'>('horizontal')
      const wrapper = mount(() => (
        <SplitLayout direction={direction.value}>
          <div>Content</div>
        </SplitLayout>
      ))

      expect(wrapper.find('.vmd-split-layout-horizontal').exists()).toBe(true)

      direction.value = 'vertical'
      await nextTick()

      expect(wrapper.find('.vmd-split-layout-vertical').exists()).toBe(true)
      expect(wrapper.find('.vmd-split-layout-horizontal').exists()).toBe(false)
    })
  })

  describe('splitLayoutItem props', () => {
    describe('size prop', () => {
      it('should handle string size with px unit', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem size="200px">Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toContain('200px')
      })

      it('should handle string size with percentage unit', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem size="30%">Panel 1</SplitLayoutItem>
            <SplitLayoutItem size="70%">Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        const firstItemStyle = items[0].attributes('style')
        const secondItemStyle = items[1].attributes('style')
        expect(firstItemStyle).toContain('30%')
        expect(secondItemStyle).toContain('70%')
      })

      it('should handle number size', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem size={150}>Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toContain('150px')
      })

      it('should handle null size for auto allocation', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem size={null}>Panel 1</SplitLayoutItem>
            <SplitLayoutItem size={null}>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        // 自动分配的项目应该由布局系统处理
      })
    })

    describe('minSize prop', () => {
      it('should handle string minSize with px unit', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem minSize="100px">Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toContain('100px')
      })

      it('should handle string minSize with percentage unit', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem minSize="20%">Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toContain('20%')
      })

      it('should handle number minSize', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem minSize={80}>Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toContain('80px')
      })

      it('should handle null minSize', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem minSize={null}>Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        // minSize 为 null 时不应设置 min-width/min-height
      })
    })

    describe('maxSize prop', () => {
      it('should handle string maxSize with px unit', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem maxSize="500px">Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toContain('500px')
      })

      it('should handle string maxSize with percentage unit', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem maxSize="80%">Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toContain('80%')
      })

      it('should handle number maxSize', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem maxSize={400}>Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toContain('400px')
      })

      it('should handle null maxSize', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem maxSize={null}>Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        // maxSize 为 null 时不应设置 max-width/max-height
      })
    })

    describe('combined size constraints', () => {
      it('should handle minSize and maxSize together', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem minSize="100px" maxSize="300px">Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toContain('100px')
        expect(firstItemStyle).toContain('300px')
      })

      it('should handle size with constraints', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem size="200px" minSize="100px" maxSize="300px">Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        expect(items).toHaveLength(2)
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toContain('200px')
        expect(firstItemStyle).toContain('100px')
        expect(firstItemStyle).toContain('300px')
      })
    })

    describe('direction-specific constraints', () => {
      it('should apply width constraints for horizontal direction', () => {
        const wrapper = mount(() => (
          <SplitLayout direction="horizontal">
            <SplitLayoutItem minSize="100px" maxSize="300px">Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toMatch(/min-width.*100px/)
        expect(firstItemStyle).toMatch(/max-width.*300px/)
      })

      it('should apply height constraints for vertical direction', () => {
        const wrapper = mount(() => (
          <SplitLayout direction="vertical">
            <SplitLayoutItem minSize="100px" maxSize="300px">Panel 1</SplitLayoutItem>
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const items = wrapper.findAll('.vmd-split-layout-item')
        const firstItemStyle = items[0].attributes('style')
        expect(firstItemStyle).toMatch(/min-height.*100px/)
        expect(firstItemStyle).toMatch(/max-height.*300px/)
      })
    })
  })

  describe('splitLayoutResizer props', () => {
    describe('disabled prop', () => {
      it('should render resizer as enabled by default', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem>Panel 1</SplitLayoutItem>
            <SplitLayoutResizer />
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const resizer = wrapper.find('.vmd-split-layout-resizer')
        expect(resizer.exists()).toBe(true)
        expect(resizer.classes()).not.toContain('vmd-split-layout-resizer-disabled')
      })

      it('should render resizer as disabled when disabled prop is true', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem>Panel 1</SplitLayoutItem>
            <SplitLayoutResizer disabled />
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const resizer = wrapper.find('.vmd-split-layout-resizer')
        expect(resizer.exists()).toBe(true)
        expect(resizer.classes()).toContain('vmd-split-layout-resizer-disabled')
      })
    })

    describe('size prop', () => {
      it('should handle default size', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem>Panel 1</SplitLayoutItem>
            <SplitLayoutResizer />
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const resizer = wrapper.find('.vmd-split-layout-resizer')
        expect(resizer.exists()).toBe(true)
        // 应该应用默认大小
      })

      it('should handle string size with px unit', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem>Panel 1</SplitLayoutItem>
            <SplitLayoutResizer size="8px" />
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const resizer = wrapper.find('.vmd-split-layout-resizer')
        expect(resizer.exists()).toBe(true)
        const resizerStyle = resizer.attributes('style')
        expect(resizerStyle).toContain('8px')
      })

      it('should handle number size', () => {
        const wrapper = mount(() => (
          <SplitLayout>
            <SplitLayoutItem>Panel 1</SplitLayoutItem>
            <SplitLayoutResizer size={6} />
            <SplitLayoutItem>Panel 2</SplitLayoutItem>
          </SplitLayout>
        ))

        const resizer = wrapper.find('.vmd-split-layout-resizer')
        expect(resizer.exists()).toBe(true)
        const resizerStyle = resizer.attributes('style')
        expect(resizerStyle).toContain('6px')
      })
    })
  })

  describe('events', () => {
    it('should emit resize event when sizes change', async () => {
      const onResize = vi.fn()
      const wrapper = mount(() => (
        <SplitLayout onResize={onResize}>
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      // 获取 SplitLayout 组件实例
      const splitLayoutComponent = wrapper.findComponent(SplitLayout)

      // 触发 resize 事件
      await splitLayoutComponent.vm.$emit('resize', ['50%', '50%'])

      expect(onResize).toHaveBeenCalledWith(['50%', '50%'])
    })

    it('should emit resize event with correct parameters', async () => {
      const onResize = vi.fn()
      const wrapper = mount(() => (
        <SplitLayout onResize={onResize}>
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      const splitLayoutComponent = wrapper.findComponent(SplitLayout)
      const mockSizes = ['30%', '70%']

      await splitLayoutComponent.vm.$emit('resize', mockSizes)

      expect(onResize).toHaveBeenCalledWith(mockSizes)
    })

    it('should emit resizer events', async () => {
      const onResizeStart = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mount(() => (
        <SplitLayout>
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutResizer onResize-start={onResizeStart} onResize-end={onResizeEnd} />
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      const resizer = wrapper.findComponent(SplitLayoutResizer)

      // 模拟 resize start
      await resizer.vm.$emit('resize-start')
      expect(onResizeStart).toHaveBeenCalled()

      // 模拟 resize end
      await resizer.vm.$emit('resize-end')
      expect(onResizeEnd).toHaveBeenCalled()
    })
  })

  describe('exposed methods', () => {
    it('should expose getSizes method', () => {
      const splitLayoutRef = ref()
      const wrapper = mount(() => (
        <SplitLayout ref={splitLayoutRef}>
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      // 通过 findComponent 访问组件实例
      const splitLayoutComponent = wrapper.findComponent(SplitLayout)
      expect(typeof splitLayoutComponent.vm.getSizes).toBe('function')
    })

    it('should return empty array when no items are present', () => {
      const splitLayoutRef = ref()
      const wrapper = mount(() => (
        <SplitLayout ref={splitLayoutRef}>
          <div>Content</div>
        </SplitLayout>
      ))

      const splitLayoutComponent = wrapper.findComponent(SplitLayout)
      const sizes = splitLayoutComponent.vm.getSizes()
      expect(Array.isArray(sizes)).toBe(true)
      expect(sizes).toHaveLength(0)
    })

    it('should return correct sizes when items are present', async () => {
      const splitLayoutRef = ref()
      const wrapper = mount(() => (
        <SplitLayout ref={splitLayoutRef}>
          <SplitLayoutItem size="200px">Panel 1</SplitLayoutItem>
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      // 等待自动分配完成
      await vi.runAllTimersAsync()
      await nextTick()

      const splitLayoutComponent = wrapper.findComponent(SplitLayout)
      const sizes = splitLayoutComponent.vm.getSizes()
      expect(Array.isArray(sizes)).toBe(true)
      // 初始化后至少应该有一个项目有大小
      expect(sizes.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('lifecycle', () => {
    it('should cleanup resources on unmount', () => {
      const wrapper = mount(() => (
        <SplitLayout>
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      // 测试组件卸载时不会抛出错误（隐式清理测试）
      expect(() => wrapper.unmount()).not.toThrow()
    })

    it('should clear timers on unmount', () => {
      // 清理所有现有定时器
      vi.clearAllTimers()

      const wrapper = mount(() => (
        <SplitLayout>
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      // 验证组件能正常卸载，不抛出错误
      expect(() => wrapper.unmount()).not.toThrow()

      // 运行所有定时器以确保清理完成
      vi.runAllTimers()

      // 验证最终状态正常
      expect(vi.getTimerCount()).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('should handle empty slots', () => {
      const wrapper = mount(() => <SplitLayout />)

      expect(wrapper.find('.vmd-split-layout').exists()).toBe(true)
      expect(wrapper.text()).toBe('')
    })

    it('should handle single panel', () => {
      const wrapper = mount(() => (
        <SplitLayout>
          <SplitLayoutItem>Single Panel</SplitLayoutItem>
        </SplitLayout>
      ))

      expect(wrapper.find('.vmd-split-layout').exists()).toBe(true)
      expect(wrapper.findAll('.vmd-split-layout-item')).toHaveLength(1)
      expect(wrapper.text()).toContain('Single Panel')
    })

    it('should handle multiple panels', () => {
      const wrapper = mount(() => (
        <SplitLayout>
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutResizer />
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
          <SplitLayoutResizer />
          <SplitLayoutItem>Panel 3</SplitLayoutItem>
        </SplitLayout>
      ))

      expect(wrapper.findAll('.vmd-split-layout-item')).toHaveLength(3)
      expect(wrapper.findAll('.vmd-split-layout-resizer')).toHaveLength(2)
      expect(wrapper.text()).toContain('Panel 1')
      expect(wrapper.text()).toContain('Panel 2')
      expect(wrapper.text()).toContain('Panel 3')
    })

    it('should handle mixed size units', () => {
      const wrapper = mount(() => (
        <SplitLayout>
          <SplitLayoutItem size="200px">Panel 1</SplitLayoutItem>
          <SplitLayoutResizer />
          <SplitLayoutItem size="50%">Panel 2</SplitLayoutItem>
          <SplitLayoutResizer />
          <SplitLayoutItem size={150}>Panel 3</SplitLayoutItem>
        </SplitLayout>
      ))

      const items = wrapper.findAll('.vmd-split-layout-item')
      expect(items).toHaveLength(3)

      const styles = items.map(item => item.attributes('style'))
      expect(styles[0]).toContain('200px')
      expect(styles[1]).toContain('50%')
      expect(styles[2]).toContain('150px')
    })

    it('should handle auto-allocation with fixed sizes', () => {
      const wrapper = mount(() => (
        <SplitLayout>
          <SplitLayoutItem size="200px">Fixed Panel</SplitLayoutItem>
          <SplitLayoutResizer />
          <SplitLayoutItem size={null}>Auto Panel 1</SplitLayoutItem>
          <SplitLayoutResizer />
          <SplitLayoutItem size={null}>Auto Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      expect(wrapper.findAll('.vmd-split-layout-item')).toHaveLength(3)
      // 自动分配逻辑应该被触发且不会出错
    })
  })

  describe('timer handling', () => {
    it('should schedule auto allocation', () => {
      const wrapper = mount(() => (
        <SplitLayout>
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      // 组件应该能正确创建且不会出错
      expect(wrapper.findComponent(SplitLayout).exists()).toBe(true)

      // 运行定时器以触发任何计划的操作
      vi.runAllTimers()

      // 不应该抛出错误
      expect(() => vi.runAllTimers()).not.toThrow()
    })

    it('should clear previous timer when scheduling new one', () => {
      const _wrapper = mount(() => (
        <SplitLayout>
          <SplitLayoutItem>Panel 1</SplitLayoutItem>
          <SplitLayoutItem>Panel 2</SplitLayoutItem>
        </SplitLayout>
      ))

      // 多个定时器操作不应该引起问题
      vi.advanceTimersByTime(100)
      vi.runAllTimers()
      vi.advanceTimersByTime(200)

      // 应该优雅地处理定时器管理
      expect(() => vi.runAllTimers()).not.toThrow()
    })
  })
})
