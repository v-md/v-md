export type Func<T = any> = (...args: any[]) => T

export type Functionable<T> = T | Func<T>
