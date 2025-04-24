import type MarkdownIt from 'markdown-it'
import { mdDemoPlugin } from './md-demo'
import { mdScriptSetupPlugin } from './md-script-setup'

export function mdPlugin(md: MarkdownIt) {
  md.use(mdDemoPlugin)
  md.use(mdScriptSetupPlugin)
}
