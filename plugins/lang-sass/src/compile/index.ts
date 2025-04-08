import type {
  CompileCodeResult,
  Compiler,
} from '@v-md/core'
import { getCanonicalize } from './canonicalize'
import { getLoader } from './load'

/**
 * sass 编译
 * @param compiler 文件编译对象
 * @param result 记录编译结果
 * @param code 编译目标代码
 */
export async function compileSass(
  compiler: Compiler,
  result: CompileCodeResult,
  code: string = '',
) {
  const { file } = compiler

  const { compileStringAsync } = await import('sass')
  const res = await compileStringAsync(code, {
    importers: [{
      canonicalize: getCanonicalize(file),
      load: getLoader(file),
    }],
  })

  result.css = res.css
}
