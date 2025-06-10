import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SplitLayout from '../view/split-layout.vue'

describe('splitLayout', () => {
  it('should render correctly', () => {
    const wrapper = mount(SplitLayout, {
      slots: {
        default: [
          '<div>Panel 1</div>',
          '<div>Panel 2</div>',
        ],
      },
    })

    expect(wrapper.find('.vmd-split-layout').exists()).toBe(true)
    expect(wrapper.findAll('.vmd-split-layout-panel')).toHaveLength(2)
    expect(wrapper.findAll('.vmd-split-layout-resizer')).toHaveLength(1)
  })

  it('should apply direction class correctly', () => {
    const wrapper = mount(SplitLayout, {
      props: {
        direction: 'vertical',
      },
      slots: {
        default: [
          '<div>Panel 1</div>',
          '<div>Panel 2</div>',
        ],
      },
    })

    expect(wrapper.find('.vmd-split-layout-vertical').exists()).toBe(true)
  })

  it('should apply disabled class when disabled', () => {
    const wrapper = mount(SplitLayout, {
      props: {
        disabled: true,
      },
      slots: {
        default: [
          '<div>Panel 1</div>',
          '<div>Panel 2</div>',
        ],
      },
    })

    expect(wrapper.find('.vmd-split-layout-disabled').exists()).toBe(true)
  })

  it('should emit resize event', async () => {
    const wrapper = mount(SplitLayout, {
      slots: {
        default: [
          '<div>Panel 1</div>',
          '<div>Panel 2</div>',
        ],
      },
    })

    const component = wrapper.vm as any
    component.setSizes([30, 70])

    expect(wrapper.emitted('resize')).toBeTruthy()
    expect(wrapper.emitted('resize')?.[0]).toEqual([[30, 70]])
  })
})
