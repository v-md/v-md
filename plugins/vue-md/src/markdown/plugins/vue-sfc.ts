import type { MarkdownEnv } from '../../types'
import type { MarkdownItAsync } from '../markdown-it-async'

export function vueSfcRenderPost(_md: MarkdownItAsync, replacedStr: string, env: MarkdownEnv) {
  const template = env?.sfcBlocks?.template

  if (template) {
    template.contentStripped = replacedStr
    template.content = `<template>${replacedStr}</template>`
  }
}
