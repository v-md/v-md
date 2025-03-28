/**
 * 将对象转换为 FormData
 */
export function toFormData(data: Record<string, any>) {
  const result = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    let formValue = value
    if (!(value instanceof Blob)) {
      formValue = String(value)
    }
    result.append(key, formValue)
  })

  return result
}
