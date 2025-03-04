import type { CompileCodeResult, Compiler } from '@v-md/core'
import type { MarkdownEnv } from './types'

export async function compileVueMd(compiler: Compiler, result: CompileCodeResult, code: string = '') {
  const { files } = compiler.editor
  const { markdownIt } = files
  if (!markdownIt) {
    throw new Error('MarkdownIt is not loaded!')
  }

  const env: MarkdownEnv = {
    file: compiler.file,
  }

  await markdownIt.renderAsync(code, env)

  const {
    sfcBlocks,
  } = env

  const srcCode = [
    ...sfcBlocks?.scripts.map(item => item.content) ?? [],
    sfcBlocks?.template?.content || '',
    ...sfcBlocks?.styles.map(item => item.content) ?? [],
  ].join('\n')

  await compiler.editor.emit('onFileCompile', compiler, result, 'vue', srcCode)
}
