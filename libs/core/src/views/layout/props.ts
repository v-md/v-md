export interface LayoutProps {
  /**
   * 导航区初始宽度百分比。
   *
   * 此处百分比为导航区宽度占总宽度的百分比，下同
   */
  navWidthRatio?: number

  /** 导航区拖拽最小宽度百分比 */
  navMinWidthRatio?: number

  /** 导航区拖拽最大宽度百分比 */
  navMaxWidthRatio?: number

  /** 导航区是否可见 */
  navVisible?: boolean

  /**
   * 预览区初始宽度百分比。
   *
   * 此处百分比为预览区宽度占内容区宽度的百分比，内容区包含编辑区和预览区，不包括导航区，下同
   */
  previewWidthRatio?: number

  /** 预览区拖拽最小宽度百分比  */
  previewMinWidthRatio?: number

  /** 预览区拖拽最大宽度百分比 */
  previewMaxWidthRatio?: number

  /** 预览区是否可见 */
  previewVisible?: boolean
}
