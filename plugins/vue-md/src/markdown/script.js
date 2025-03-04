// code-group 代码组的触发
;(() => {
  window.addEventListener('click', (e) => {
    const el = e.target

    if (el.matches('[vmd-code-group] input')) {
      // input <- .tabs <- .vp-code-group
      const group = el.parentElement?.parentElement
      if (!group) {
        return
      }

      const i = Array.from(group.querySelectorAll('input')).indexOf(el)
      if (i < 0) {
        return
      }

      const blocks = group.querySelector('.blocks')
      if (!blocks) {
        return
      }

      const current = Array.from(blocks.children).find(child =>
        child.classList.contains('active'),
      )
      if (!current) {
        return
      }

      const next = blocks.children[i]
      if (!next || current === next) {
        return
      }

      current.classList.remove('active')
      next.classList.add('active')

      const label = group?.querySelector(`label[for="${el.id}"]`)
      label?.scrollIntoView({ block: 'nearest' })
    }
  })
})()

// 代码块的复制功能
;(() => {
  const timeoutIdMap = new WeakMap()

  window.addEventListener('click', (e) => {
    const el = e.target
    if (el.matches('pre[class*="language-"] > button.copy')) {
      const parent = el.parentElement
      const sibling = el.nextElementSibling?.nextElementSibling
      if (!parent || !sibling) {
        return
      }

      // eslint-disable-next-line regexp/no-unused-capturing-group
      const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(
        parent.className,
      )

      const ignoredNodes = ['.diff.remove']

      // Clone the node and remove the ignored nodes
      const clone = sibling.cloneNode(true)
      clone
        .querySelectorAll(ignoredNodes.join(','))
        .forEach(node => node.remove())

      let text = clone.textContent || ''

      if (isShell) {
        text = text.replace(/^ *(\$|>) /gm, '').trim()
      }

      copyToClipboard(text).then(() => {
        el.classList.add('copied')
        clearTimeout(timeoutIdMap.get(el))
        const timeoutId = setTimeout(() => {
          el.classList.remove('copied')
          el.blur()
          timeoutIdMap.delete(el)
        }, 2000)
        timeoutIdMap.set(el, timeoutId)
      })
    }
  })

  async function copyToClipboard(text) {
    try {
      return navigator.clipboard.writeText(text)
    }
    catch {
      const element = document.createElement('textarea')
      const previouslyFocusedElement = document.activeElement

      element.value = text

      // Prevent keyboard from showing on mobile
      element.setAttribute('readonly', '')

      element.style.contain = 'strict'
      element.style.position = 'absolute'
      element.style.left = '-9999px'
      element.style.fontSize = '12pt' // Prevent zooming on iOS

      const selection = document.getSelection()
      const originalRange = selection ?
        selection.rangeCount > 0 && selection.getRangeAt(0) :
        null

      document.body.appendChild(element)
      element.select()

      // Explicit selection workaround for iOS
      element.selectionStart = 0
      element.selectionEnd = text.length

      document.execCommand('copy')
      document.body.removeChild(element)

      if (originalRange) {
        selection.removeAllRanges() // originalRange can't be truthy when selection is falsy
        selection.addRange(originalRange)
      }

      // Get the focus back on the previously focused element, if any
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus()
      }
    }
  }
})()
