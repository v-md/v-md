import type { Editor } from '@v-md/core'
import type MarkdownIt from 'markdown-it'

const markerRE =
  /^\[!(TIP|NOTE|INFO|IMPORTANT|WARNING|CAUTION|DANGER)\]([^\n\r]*)/i

export function gitHubAlertsPlugin(md: MarkdownIt, editor: Editor) {
  const containerOptions = editor.options.markdownOptions.container
  const {
    tipLabel = 'TIP',
    infoLabel = 'INFO',
    warningLabel = 'WARNING',
    dangerLabel = 'DANGER',
    cautionLabel = 'CAUTION',
    importantLabel = 'IMPORTANT',
    noteLabel = 'NOTE',
  } = containerOptions || {}

  const titleMark: Record<string, string> = {
    tip: tipLabel,
    info: infoLabel,
    important: importantLabel,
    warning: warningLabel,
    caution: cautionLabel,
    danger: dangerLabel,
    note: noteLabel,
  }

  md.core.ruler.after('block', 'github-alerts', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'blockquote_open') {
        const startIndex = i
        const open = tokens[startIndex]
        let endIndex = i + 1
        while (
          endIndex < tokens.length &&
          (tokens[endIndex].type !== 'blockquote_close' ||
            tokens[endIndex].level !== open.level)
        ) {
          endIndex++
        }
        if (endIndex === tokens.length)
          continue
        const close = tokens[endIndex]
        const firstContent = tokens
          .slice(startIndex, endIndex + 1)
          .find(token => token.type === 'inline')
        if (!firstContent)
          continue
        const match = firstContent.content.match(markerRE)
        if (!match)
          continue
        const type = match[1].toLowerCase()
        const title = match[2].trim() || titleMark[type] || capitalize(type)
        firstContent.content = firstContent.content
          .slice(match[0].length)
          .trimStart()
        open.type = 'github_alert_open'
        open.tag = 'div'
        open.meta = {
          title,
          type,
        }
        close.type = 'github_alert_close'
        close.tag = 'div'
      }
    }
  })
  md.renderer.rules.github_alert_open = function (tokens, idx) {
    const { title, type } = tokens[idx].meta
    const attrs = ''
    return `<div class="${type} custom-block github-alert"${attrs}><p class="custom-block-title">${title}</p>\n`
  }
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
