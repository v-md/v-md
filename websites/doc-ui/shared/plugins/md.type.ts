import type MarkdownIt from 'markdown-it'
import type { IterableElement } from 'type-fest'

export type Token = IterableElement<ReturnType<MarkdownIt['parse']>>
export type Renderer = MarkdownIt['renderer']
