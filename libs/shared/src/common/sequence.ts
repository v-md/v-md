export interface SequenceItem {
  /** 子项名称，插入、删除时的定位都以名称为依据 */
  name: string
}

/** 列表插入位置选项 */
export interface SequencePositionOptions {
  /**
   * 插入到指定名称对象之前。
   *
   * 若与 after 同时指定，则只有 before 生效。
   *
   * 若与 after 都不指定，则插入到列表末尾。
   */
  before?: string

  /**
   * 插入到指定名称对象之后。
   *
   * 若与 before 同时指定，则只有 before 生效。
   *
   * 若与 before 都不指定，则插入到列表末尾。
   */
  after?: string
}

/** 列表插入位置选项解析结果 */
export interface SequencePositionResolveResult {
  /** 定位目标名称。未获取到时为空串 */
  name: string

  /**
   * 该次定位操作的插入模式：
   * - before：插入到目标对象之前
   * - after：插入到目标对象之后
   * - end：插入到列表末尾
   */
  mode: 'before' | 'after' | 'end'
}

/**
 * 解析列表插入选项
 * @param options 选项对象 {@link SequencePositionOptions}
 * @returns 解析结果 {@link SequencePositionResolveResult}
 */
export function resoveSequencePositionOptions(options?: SequencePositionOptions): SequencePositionResolveResult {
  const { before, after } = options || {}
  if (before) {
    return { name: before, mode: 'before' }
  }

  if (after) {
    return { name: after, mode: 'after' }
  }

  return { name: '', mode: 'end' }
}

/**
 * 从序列中获取指定名称的子项
 * @param sequence 序列，必须继承自 {@link SequenceItem}
 * @param name 子项名称
 * @returns 子项对象，若未找到则返回 null
 */
export function getItemFromSequence<T extends SequenceItem = SequenceItem>(
  sequence: T[],
  name: string,
) {
  const target = sequence.find(item => item.name === name)
  if (!target) {
    return null
  }
  return target
}

export interface SequenceInsertOptions extends SequencePositionOptions {
  /** 插入的子项重复(列表中已有同名的其他项)时触发 */
  onDuplicate?: () => void

  /** 无法获取所指定的插入目标时触发 */
  onMissingTarget?: (targetName: string) => void
}

/**
 * 向序列中插入子项
 * @param sequence 序列，必须继承自 {@link SequenceItem}
 * @param item 子项对象，必须继承自 {@link SequenceItem}
 * @param options 插入选项 {@link SequenceInsertOptions}
 * @returns 子项加入到序列返回 true，否则返回 false
 */
export function insertIntoSequence(
  sequence: SequenceItem[],
  item: SequenceItem,
  options?: SequenceInsertOptions,
) {
  const {
    onDuplicate,
    onMissingTarget,
  } = options || {}

  const existedItem = getItemFromSequence(sequence, item.name)
  if (existedItem) {
    onDuplicate?.()
    return false
  }

  const { name: targetName, mode } = resoveSequencePositionOptions(options)

  if (mode === 'end') {
    sequence.push(item)
    return true
  }

  const index = sequence.findIndex(item => item.name === targetName)
  if (index < 0) {
    onMissingTarget?.(targetName)
    sequence.push(item)
    return true
  }

  if (mode === 'before') {
    sequence.splice(index, 0, item)
    return true
  }

  sequence.splice(index + 1, 0, item)
  return true
}

export interface SequenceRemoveOptions<T extends SequenceItem = SequenceItem> {
  /** 删除的子项不存在时触发 */
  onNotFound?: () => void

  /** 子项从列表移除前触发 */
  onBeforeRemove?: (target: T) => void
}

/**
 * 从序列中删除指定名称的子项
 * @param sequence 序列，必须继承自 {@link SequenceItem}
 * @param name 子项名称
 * @param options 删除选项 {@link SequenceRemoveOptions}
 * @returns 子项成功从序列中移除时返回子项本身，否则返回 null
 */
export function removeFromSequence<T extends SequenceItem = SequenceItem>(
  sequence: T[],
  name: string,
  options?: SequenceRemoveOptions<T>,
) {
  const { onNotFound, onBeforeRemove } = options || {}
  const index = sequence.findIndex(item => item.name === name)
  if (index < 0) {
    onNotFound?.()
    return null
  }

  const target = sequence[index]
  onBeforeRemove?.(target)
  sequence.splice(index, 1)
  return target
}
