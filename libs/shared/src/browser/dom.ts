/**
 * 查找具有指定 dataset 属性的兄弟元素
 * @param startEl 起始元素
 * @param direction 查找方向，previousSibling 或 nextSibling
 * @param datasetKey 要查找的 dataset 属性名
 * @returns 找到的元素或 null
 */
export function findSiblingWithDataset<T extends ChildNode = ChildNode>(
  startEl: HTMLElement,
  direction: 'previousSibling' | 'nextSibling',
  datasetKey: string,
): T | null {
  let cur = startEl[direction]
  while (cur) {
    if ((cur as any)?.dataset?.[datasetKey] !== undefined) {
      return cur as T
    }
    cur = cur[direction]
  }
  return null
}
