import type {
  CompiledCodeData,
  CompiledData,
  ViewerOptions,
} from './types'
import { atou, isObjectLike } from '@v-md/shared'
import MagicString from 'magic-string'
import { createSandboxIframe } from './create-iframe'
import htmlTemplate from './srcdoc.html?raw'

export function createViewer(el: string | HTMLElement = '#app', options?: ViewerOptions) {
  let target: HTMLElement | null = null
  if (typeof el === 'string') {
    target = document.querySelector(el)
  }
  else {
    target = el
  }

  if (!target) {
    throw new Error('Target element not found')
  }

  const {
    cdnUrl = 'https://cdn.jsdelivr.net/npm',
    previewOptions = {},
    value = '',
  } = options || {}

  const data = resolveCompiledData(value)

  resolveCompiledCodes(data)

  const sandbox = createSandboxIframe({
    el: target,
    htmlTemplate,
    srcMode: 'bloburl',
    importMapTxt: JSON.stringify(data.importMap),
    headHtml: previewOptions.headHtml,
    cdnUrl,
    scriptUrl: data.codes[data.main].url,
  })

  const sandboxLoadHandler = () => {
    iframeResize(sandbox)
  }

  sandbox.addEventListener('load', sandboxLoadHandler)

  const dispose = () => {
    const sandboxUrl = sandbox.src
    sandbox.removeEventListener('load', sandboxLoadHandler)
    sandbox.remove()

    // 清除所有 blob url
    URL.revokeObjectURL(sandboxUrl)
    Object.values(data.codes).forEach((code) => {
      code.moduleJs = ''
      URL.revokeObjectURL(code.url || '')
      code.url = ''
    })
  }

  return {
    dispose,
  }
}

function resolveCompiledData(value: string | CompiledData) {
  if (isObjectLike(value)) {
    return value
  }

  let compiledData: CompiledData | null = null
  try {
    compiledData = JSON.parse(atou(value))
  }
  catch {}

  if (!compiledData) {
    throw new Error('Parse viewer value error!')
  }

  return compiledData
}

function resolveCompiledCodes(data: CompiledData) {
  const { codes } = data

  const isCodeFinished = new Map<CompiledCodeData, boolean>()

  const resolveCode = (filePath: string, curCode: CompiledCodeData) => {
    if (isCodeFinished.has(curCode)) {
      if (isCodeFinished.get(curCode)) {
        // 访问到的模块已完成处理
        return
      }

      // 访问到未完成编译的模块，说明存在循环依赖，抛出错误
      throw new Error(`Circular dependency: ${filePath}`)
    }

    isCodeFinished.set(curCode, false)
    const s = new MagicString(curCode.js)
    for (const [start, end, targetPath] of curCode.mem) {
      const targetCode = codes[targetPath]
      if (targetCode) {
        resolveCode(targetPath, targetCode)
      }

      s.overwrite(start, end, JSON.stringify(targetCode.url || ''))
    }

    curCode.moduleJs = s.toString()
    curCode.url = URL.createObjectURL(new Blob([curCode.moduleJs], { type: 'text/javascript' }))
    isCodeFinished.set(curCode, true)
  }

  for (const [codePath, code] of Object.entries(codes)) {
    resolveCode(codePath, code)
  }
}

function iframeResize(iframe: HTMLIFrameElement) {
  const sandboxWindow = iframe.contentWindow
  if (sandboxWindow?.document.body) {
    iframe.style.height = `${
      sandboxWindow.document.documentElement.scrollHeight ||
      sandboxWindow.document.body.scrollHeight
    }px`
  }
}
