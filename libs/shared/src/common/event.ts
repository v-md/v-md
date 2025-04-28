import type { Func } from './types'
import { toPromise } from './promise'
import { isFunction } from './type-check'

export class EventEmitter<
  EventsMap extends Record<string, Func> = Record<string, Func>,
> {
  private _eventsMap = new Map<keyof EventsMap, Func[]>()

  /**
   * 事件监听
   * @param event 事件名称
   * @param handler 监听器
   * @param insertIndex 监听器插入位置。若不填则默认插入到末尾
   */
  on<T extends keyof EventsMap>(
    event: T,
    handler: EventsMap[T],
    insertIndex: number = -1,
  ) {
    const events = this.eventList(event)
    if (!events) {
      this._eventsMap.set(event, [handler])
    }
    else if (insertIndex < 0 || insertIndex >= events.length) {
      events.push(handler)
    }
    else {
      events.splice(insertIndex, 0, handler)
    }
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 传递给触发器的参数
   */
  async emit<T extends keyof EventsMap>(event: T, ...args: Parameters<EventsMap[T]>) {
    const events = this.eventList(event)
    if (!events) {
      return
    }

    for (const handler of events) {
      if (isFunction(handler)) {
        await toPromise(handler, args as any)
      }
    }
  }

  /**
   * 同步触发事件
   * @param event 事件名称
   * @param args 传递给触发器的参数
   */
  emitSync<T extends keyof EventsMap>(event: T, ...args: Parameters<EventsMap[T]>) {
    const events = this.eventList(event)
    if (!events) {
      return
    }

    for (const handler of events) {
      if (isFunction(handler)) {
        handler(...args)
      }
    }
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param handler 监听器方法
   */
  off<T extends keyof EventsMap>(event: T, handler: EventsMap[T]) {
    const events = this.eventList(event)
    if (!events) {
      return
    }

    const index = events.indexOf(handler)
    if (index >= 0) {
      events.splice(index, 1)
    }
  }

  /**
   * 获取指定事件的监听器列表
   * @param event 事件名称
   * @returns 监听器列表。若事件从未注册，则返回 null
   */
  eventList<T extends keyof EventsMap>(event: T) {
    const events = this._eventsMap.get(event)
    if (!events) {
      return null
    }
    return events as EventsMap[T][]
  }

  /**
   * 获取指定事件的监听器索引
   * @param event 事件名称
   * @param handler 监听器方法
   * @return 监听器索引，若不存在则返回 -1
   */
  eventIndex<T extends keyof EventsMap>(event: T, handler: EventsMap[T]) {
    const events = this.eventList(event)
    if (!events) {
      return -1
    }

    return events.indexOf(handler)
  }

  /**
   * 获取指定事件的监听器数量
   * @param event 事件名称
   * @return 监听器数量，若不存在则返回 0
   */
  eventCount<T extends keyof EventsMap>(event: T) {
    const events = this.eventList(event)
    if (!events) {
      return 0
    }

    return events.length
  }

  /**
   * 移除指定事件的所有监听器
   * @param event 事件名称
   */
  clearEvent(event: keyof EventsMap) {
    this._eventsMap.delete(event)
  }

  /** 移除所有事件监听器 */
  clearAllEvents() {
    this._eventsMap.clear()
  }
}
