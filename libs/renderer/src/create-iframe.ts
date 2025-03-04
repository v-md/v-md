export interface CreateSandboxIframeOptions {
  /** 外部容器元素 */
  el: HTMLElement

  /** 基础的 HTML 模板 */
  htmlTemplate: string

  /**
   * 文档源插入方式
   * - bloburl: 使用 blob url 插入文档源
   * - srcdoc: 使用 srcdoc 插入文档源
   * @default 'srcdoc'
   */
  srcMode?: 'bloburl' | 'srcdoc'

  /** import-map 字符串 */
  importMapTxt?: string

  /** 插到头部 <head> 中额外的 html 内容 */
  headHtml?: string

  /** polifill 的分发 url */
  cdnUrl?: string

  /** <script type="module"> 的 url */
  scriptUrl?: string
}

export function createSandboxIframe(options: CreateSandboxIframeOptions) {
  const {
    el,
    htmlTemplate,
    srcMode = 'srcdoc',
    importMapTxt = '',
    headHtml = '',
    cdnUrl = '',
    scriptUrl = '',
  } = options

  Object.assign(el.style, {
    width: '100%',
    height: '100%',
    border: 'none',
  })

  const sandbox = document.createElement('iframe')
  sandbox.setAttribute(
    'sandbox',
    [
      'allow-forms',
      'allow-modals',
      'allow-pointer-lock',
      'allow-popups',
      'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation-by-user-activation',
    ].join(' '),
  )
  Object.assign(sandbox.style, {
    width: '100%',
    height: '100%',
    border: 'none',
    verticalAlign: 'middle',
  })

  let sandboxSrc = htmlTemplate

  if (importMapTxt) {
    sandboxSrc = sandboxSrc
      .replace(/<!--IMPORT_MAP-->/, importMapTxt)
  }

  if (headHtml) {
    sandboxSrc = sandboxSrc
      .replace(/<!-- PREVIEW-OPTIONS-HEAD-HTML -->/, headHtml)
  }

  if (cdnUrl) {
    sandboxSrc = sandboxSrc.replace(/\{\{\s*CDN_URL\s*\}\}/g, cdnUrl)
  }

  if (scriptUrl) {
    sandboxSrc = sandboxSrc.replace(/\{\{\s*SCRIPT_URL\s*\}\}/g, scriptUrl)
  }

  if (srcMode === 'bloburl') {
    const blob = new Blob([sandboxSrc], { type: 'text/html' })
    sandbox.src = URL.createObjectURL(blob)
  }
  else {
    sandbox.srcdoc = sandboxSrc
  }

  el.appendChild(sandbox)
  return sandbox
}
