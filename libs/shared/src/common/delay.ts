export function delay(ms: number) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, ms)
  })
}
