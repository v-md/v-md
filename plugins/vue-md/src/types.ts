import type { ComponentPluginOptions } from '@mdit-vue/plugin-component'
import type { FrontmatterPluginOptions } from '@mdit-vue/plugin-frontmatter'
import type { HeadersPluginOptions } from '@mdit-vue/plugin-headers'
import type { SfcPluginOptions } from '@mdit-vue/plugin-sfc'
import type { TocPluginOptions } from '@mdit-vue/plugin-toc'
import type { FileNode } from '@v-md/core'
import type { Promisable } from '@v-md/shared'
import type anchorPlugin from 'markdown-it-anchor'
import type {
  Highlighter,
  LanguageInput,
  ShikiTransformer,
} from 'shiki'
import type { MarkdownItAsync, MarkdownItAsyncOptions } from './markdown/markdown-it-async'
import type {
  CustomContainerOptions,
  ImageOptions,
} from './markdown/plugins'

declare module '@v-md/core' {
  interface FileManager {
    /** markdown-it 渲染器对象 */
    markdownIt?: MarkdownItAsync
  }

  interface EditorOptions {
    /** markdown 编译配置项 */
    markdownOptions?: MarkdownOptions
  }
}

export interface MarkdownOptions extends MarkdownItAsyncOptions {
  /**
   * Setup markdown-it instance after applying preset plugins
   */
  config?: (md: MarkdownItAsync) => Promisable<void>

  /**
   * Setup markdown-it instance without applying preset plugins
   *
   * If set, other options will be ignored
   */
  configOverride?: (md: MarkdownItAsync) => Promisable<void>

  /**
   * Languages for syntax highlighting.
   * @see https://shiki.style/languages
   */
  languages?: LanguageInput[]

  /**
   * Custom language aliases.
   *
   * @example { 'my-lang': 'js' }
   * @see https://shiki.style/guide/load-lang#custom-language-aliases
   */
  languageAlias?: Record<string, string>

  /**
   * 高亮主题
   * @default 'light-plus'
   */
  highlightTheme?: string

  /**
   * Transformers applied to code blocks
   * @see https://shiki.style/guide/transformers
   */
  codeTransformers?: ShikiTransformer[]

  /**
   * Setup Shiki instance
   */
  shikiSetup?: (shiki: Highlighter) => void | Promise<void>

  /**
   * Show line numbers in code blocks
   * @default false
   */
  lineNumbers?: boolean

  /**
   * The tooltip text for the copy button in code blocks
   * @default 'Copy Code'
   */
  codeCopyButtonTitle?: string

  /**
   * Options for `@mdit-vue/plugin-component`
   * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-component
   */
  component?: ComponentPluginOptions

  /**
   * Options for custom containers
   */
  container?: CustomContainerOptions

  image?: ImageOptions

  /**
   * Allows disabling the github alerts plugin
   * @default true
   * @see https://vitepress.dev/guide/markdown#github-flavored-alerts
   */
  gfmAlerts?: boolean

  /**
   * Options for `markdown-it-anchor`
   * @see https://github.com/valeriangalliat/markdown-it-anchor
   */
  anchor?: anchorPlugin.AnchorOptions

  /**
   * Options for `@mdit-vue/plugin-headers`
   * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-headers
   */
  headers?: HeadersPluginOptions | boolean

  /**
   * Options for `@mdit-vue/plugin-frontmatter`
   * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-frontmatter
   */
  frontmatter?: FrontmatterPluginOptions

  /**
   * Options for `@mdit-vue/plugin-sfc`
   * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-sfc
   */
  sfc?: SfcPluginOptions

  /**
   * Options for `@mdit-vue/plugin-toc`
   * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-toc
   */
  toc?: TocPluginOptions

  /**
   * Options for `markdown-it-attrs`
   * @see https://github.com/arve0/markdown-it-attrs
   */
  attrs?: {
    leftDelimiter?: string
    rightDelimiter?: string
    allowedAttributes?: Array<string | RegExp>
    disable?: boolean
  }

  /**
   * Options for `markdown-it-emoji`
   * @see https://github.com/markdown-it/markdown-it-emoji
   */
  emoji?: {
    defs?: Record<string, string>
    enabled?: string[]
    shortcuts?: Record<string, string | string[]>
  }

  /**
   * Math support
   *
   * You can also pass options to `markdown-it-mathjax3` here.
   * @default false
   * @see https://vitepress.dev/guide/markdown#math-equations
   */
  math?: boolean | any

  /**
   * 是否引入部分 markdown 组件的基础样式
   * @default true
   */
  baseStyles?: boolean

  /**
   * 是否引入部分 markdown 组件的基础交互逻辑
   * @default true
   */
  baseScripts?: boolean
}

export interface MarkdownEnv {
  /**
   * The raw Markdown content without frontmatter
   */
  content?: string
  /**
   * The excerpt that extracted by `@mdit-vue/plugin-frontmatter`
   *
   * - Would be the rendered HTML when `renderExcerpt` is enabled
   * - Would be the raw Markdown when `renderExcerpt` is disabled
   */
  excerpt?: string
  /**
   * The frontmatter that extracted by `@mdit-vue/plugin-frontmatter`
   */
  frontmatter?: Record<string, any>
  /**
   * The headers that extracted by `@mdit-vue/plugin-headers`
   */
  headers?: MditVueHeader[]
  /**
   * SFC blocks that extracted by `@mdit-vue/plugin-sfc`
   */
  sfcBlocks?: MditVueSfcBlocks
  /**
   * The title that extracted by `@mdit-vue/plugin-title`
   */
  title?: string

  /** 目标文件 */
  file: FileNode

  includes?: string[]
}

export interface MditVueSfcBlocks {
  /**
   * The `<template>` block
   */
  template: MditVueSfcBlock | null
  /**
   * The common `<script>` block
   */
  script: MditVueSfcBlock | null
  /**
   * The `<script setup>` block
   */
  scriptSetup: MditVueSfcBlock | null
  /**
   * All `<script>` blocks.
   *
   * By default, SFC only allows one `<script>` block and one `<script setup>` block.
   * However, some tools may support different types of `<script>`s, so we keep all of them here.
   */
  scripts: MditVueSfcBlock[]
  /**
   * All `<style>` blocks.
   */
  styles: MditVueSfcBlock[]
  /**
   * All custom blocks.
   */
  customBlocks: MditVueSfcBlock[]
}

/**
 * SFC block extracted from markdown
 */
export interface MditVueSfcBlock {
  /**
   * The type of the block
   */
  type: string
  /**
   * The content, including open-tag and close-tag
   */
  content: string
  /**
   * The content that stripped open-tag and close-tag off
   */
  contentStripped: string
  /**
   * The open-tag
   */
  tagOpen: string
  /**
   * The close-tag
   */
  tagClose: string
}

export interface MditVueHeader {
  /**
   * The level of the header
   *
   * `1` to `6` for `<h1>` to `<h6>`
   */
  level: number
  /**
   * The title of the header
   */
  title: string
  /**
   * The slug of the header
   *
   * Typically the `id` attr of the header anchor
   */
  slug: string
  /**
   * Link of the header
   *
   * Typically using `#${slug}` as the anchor hash
   */
  link: string
  /**
   * The children of the header
   */
  children: MditVueHeader[]
}
