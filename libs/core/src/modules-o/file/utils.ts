import type { FileNode } from './file'

/**
 * 一个文件节点列表中，若节点之间互有父子关系，则只保留最顶层的节点
 * @param nodes 待处理列表
 * @returns 处理后的列表
 */
export function excludeRelativeLeafFiles(nodes: Set<FileNode>) {
  const result = new Set<FileNode>()
  nodes.forEach((node) => {
    if (!node.parent.value || !nodes.has(node.parent.value)) {
      result.add(node)
    }
  })
  return result
}

export function getMapId(path: string, isFolder: boolean = false) {
  return isFolder ? `folder:${path}` : `file:${path}`
}
