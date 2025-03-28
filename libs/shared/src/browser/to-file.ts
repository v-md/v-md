import { isDataURL } from '../common'

export function dataURLToFile(dataURL: string, filename: string) {
  if (!isDataURL(dataURL)) {
    return null
  }

  // 分割 DataURL
  const [header, base64Data] = dataURL.split(',')
  const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream'

  // 解码 Base64
  const byteString = atob(base64Data)

  // 转换为 Uint8Array
  const arrayBuffer = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    arrayBuffer[i] = byteString.charCodeAt(i)
  }

  // 创建 File 对象
  return new File([arrayBuffer], filename, { type: mimeType })
}
