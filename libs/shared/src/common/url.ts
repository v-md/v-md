export function isDataURL(str: string) {
  return /^data:[^\n\r,\u2028\u2029]*,.*$/.test(str)
}

export function isHttpUrl(str: string) {
  return /^https?:\/\/[^\n\r,\u2028\u2029]*$/.test(str)
}

export function isFileUrl(str: string) {
  return /^file:\/\/[^\n\r,\u2028\u2029]*$/.test(str)
}
