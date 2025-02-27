import type { CompileCodeResult, Compiler } from '@v-md/core'
import type {
  BindingMetadata,
  CompilerOptions,
  SFCDescriptor,
  SFCStyleBlock,
} from 'vue/compiler-sfc'
import hashSum from 'hash-sum'

/** 编译 Vue 过程中的上下文 */
export interface VueCompileContext {
  compiler: Compiler
  result: CompileCodeResult
  hashId: string
  descriptor: SFCDescriptor
  bindings?: BindingMetadata

  /** 是否为 CustomElement */
  isCustomElement?: boolean
}

/** 脚本支持的语言列表 */
const SCRIPT_LANGS_SUPPORT = ['js', 'ts', 'jsx', 'tsx']

const SFC_IDENTIFIER = '__sfc__'

/**
 * 编译 Vue 文件
 * @param compiler 文件的编译器对象
 * @param result 编译结果对象
 * @param code 编译代码。
 */
export async function compileVue(compiler: Compiler, result: CompileCodeResult, code: string = '') {
  const { file, editor } = compiler
  const { parse } = compiler.file.manager.compilerSfc

  const { errors, descriptor } = parse(
    code,
    {
      filename: file.name.value,
      sourceMap: true,
      templateParseOptions: editor.options.sfcOptions?.template?.compilerOptions,
    },
  )

  if (errors.length) {
    throw errors[0]
  }

  const hashId = hashSum(file.path.value)

  result.js = ''
  result.css = ''

  const context: VueCompileContext = {
    compiler,
    result,
    hashId,
    descriptor,
  }

  checkSfcLang(context)

  await compileSfcScript(context)

  // template
  // only need dedicated compilation if not using <script setup>
  if (
    descriptor.template &&
    (
      !descriptor.scriptSetup ||
      editor.options.sfcOptions?.script?.inlineTemplate === false
    )
  ) {
    await compileSfcTemplate(context)
  }

  await compileSfcStyle(context)

  result.js += `
${SFC_IDENTIFIER}.__file = ${JSON.stringify(file.path.value)}
export default ${SFC_IDENTIFIER}`
  result.js = result.js.trimStart()
}

/** 检查 SFC 是否合法 */
function checkSfcLang(context: VueCompileContext) {
  const {
    compiler,
    descriptor,
  } = context

  // 模板语言检查，暂时只支持默认 HTML 模板
  const templateLang = descriptor.template?.lang
  if (templateLang) {
    throw new Error(`lang="${templateLang}" pre-processors for <template> are currently not supported.`)
  }

  // 样式语言检查
  const hasModule = descriptor.styles.some(s => s.module)
  if (hasModule) {
    // [@vue/compiler-sfc] `modules` option is not supported in the browser build
    throw new Error('<style module> syntax is currently not supported.')
  }

  const styleLangs = descriptor.styles.map(s => s.lang).filter(Boolean)
  const { sfcStyleSupportLangs = [] } = compiler.editor.files
  const unsupportedLangs = styleLangs.filter(l => !sfcStyleSupportLangs.includes(l || ''))
  if (unsupportedLangs.length) {
    throw new Error(`lang="${unsupportedLangs.join(',')}" pre-processors for <style> are currently not supported.`)
  }

  // 脚本语言检查
  const scriptLang = getScriptLang(descriptor) || 'js'
  if (!SCRIPT_LANGS_SUPPORT.includes(scriptLang)) {
    throw new Error(`Unsupported lang "${scriptLang}" in <script> blocks.`)
  }
}

/** 编译 <script> 部分 */
async function compileSfcScript(context: VueCompileContext) {
  const {
    descriptor,
    result,
    compiler,
    hashId,
  } = context
  const { editor } = compiler

  const defaultSfcCode = `const ${SFC_IDENTIFIER} = {}`
  if (!descriptor.script && !descriptor.scriptSetup) {
    result.js += defaultSfcCode
    return
  }
  const { compileScript } = compiler.file.manager.compilerSfc
  const lang = getScriptLang(descriptor) || 'js'
  const { sfcOptions } = editor.options
  const { content, bindings } = compileScript(
    descriptor,
    {
      inlineTemplate: true,
      ...sfcOptions?.script,
      id: hashId,
      genDefaultAs: SFC_IDENTIFIER,
      templateOptions: {
        ...sfcOptions?.template,
        ssr: false,
        ssrCssVars: descriptor.cssVars,
        compilerOptions: {
          ...sfcOptions?.template?.compilerOptions,
          expressionPlugins: getExpressPlugins(descriptor),
        },
      },
    },
  )

  // 触发多步编译，交给 lang-ts/lang-js 插件进行编译
  const scriptCompiledResult: CompileCodeResult = {}
  await editor.emit(
    'onFileCompile',
    compiler,
    scriptCompiledResult,
    lang,
    content,
  )
  let { js: scriptCompiledCode = '' } = scriptCompiledResult

  if (bindings) {
    context.bindings = bindings
    scriptCompiledCode = `/* Analyzed bindings: ${JSON.stringify(bindings, null, 2)} */\n${scriptCompiledCode}`
  }

  result.js += scriptCompiledCode
}

/** 当不使用 <script setup> 时，对 <template> 模板进行额外编译 */
async function compileSfcTemplate(context: VueCompileContext) {
  const {
    descriptor,
    result,
    compiler,
    hashId,
    bindings,
  } = context
  const { editor } = compiler
  const lang = getScriptLang(descriptor) || 'js'
  const { sfcOptions } = editor.options

  const { compileTemplate } = compiler.file.manager.compilerSfc
  let { code, errors } = compileTemplate({
    isProd: false,
    ...sfcOptions?.template,
    ast: descriptor.template!.ast,
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id: hashId,
    scoped: descriptor.styles.some(s => s.scoped),
    slotted: descriptor.slotted,
    ssr: false,
    ssrCssVars: descriptor.cssVars,
    compilerOptions: {
      ...sfcOptions?.template?.compilerOptions,
      bindingMetadata: bindings,
      expressionPlugins: getExpressPlugins(descriptor),
    },
  })
  if (errors.length) {
    throw errors[0]
  }

  const fnName = 'render'
  code = `\n${code.replace(
    new RegExp(`\nexport (function|const) ${fnName}`),
    `$1 ${fnName}`,
  )}` + `\n${SFC_IDENTIFIER}.${fnName} = ${fnName}`

  // 触发多步编译，交给 lang-ts/lang-js 插件进行编译
  const scriptCompiledResult: CompileCodeResult = {}
  await editor.emit(
    'onFileCompile',
    compiler,
    scriptCompiledResult,
    lang,
    code,
  )

  result.js += `;${scriptCompiledResult.js}`
}

/** 对 <style> 进行编译 */
async function compileSfcStyle(context: VueCompileContext) {
  const {
    descriptor,
    result,
    compiler,
    hashId,
  } = context
  const { editor, file } = compiler
  const { sfcOptions } = editor.options

  const hasScoped = descriptor.styles.some(s => s.scoped)
  if (hasScoped) {
    result.js += `\n${SFC_IDENTIFIER}.__scopeId = ${JSON.stringify(`data-v-${hashId}`)}`
  }

  const ceFilter = sfcOptions.script?.customElement || /\.ce\.vue$/
  const isCE = isCustomElement(ceFilter, file.name.value)
  context.isCustomElement = isCE

  const { compileStyleAsync } = compiler.file.manager.compilerSfc
  let css = ''
  const styles: string[] = []
  const errList: Error[] = []
  const promises: Promise<void>[] = []
  const handler = async (style: SFCStyleBlock) => {
    // css 预处理器编译
    const lang = style.lang || 'css'
    const styleCompiledResult: CompileCodeResult = {}
    await editor.emit(
      'onFileCompile',
      compiler,
      styleCompiledResult,
      lang,
      style.content,
    )

    const { code, errors } = await compileStyleAsync({
      ...sfcOptions?.style,
      source: styleCompiledResult.css || style.content,
      filename: file.name.value,
      id: hashId,
      scoped: style.scoped,
      modules: !!style.module,
    })
    if (errors.length) {
      errList.push(...errors)
    }
    else if (isCE) {
      styles.push(code)
    }
    else {
      css += `${code}\n`
    }
  }

  for (const style of descriptor.styles) {
    promises.push(handler(style))
  }

  await Promise.all(promises)

  if (css) {
    result.css += css.trim()
  }
  else {
    result.css += (isCE ?
      '/* The component style of the custom element will be compiled into the component object */' :
      '/* No <style> tags present */')
  }

  result.js += (
    isCE ?
      `\n${SFC_IDENTIFIER}.styles = ${JSON.stringify(styles)}` :
      ''
  )
}

function getScriptLang(descriptor: SFCDescriptor) {
  return descriptor.script?.lang || descriptor?.scriptSetup?.lang
}

function checkScriptLang(descriptor: SFCDescriptor) {
  const lang = getScriptLang(descriptor)
  const isTs = lang === 'ts' || lang === 'tsx'
  const isJsx = lang === 'jsx' || lang === 'tsx'
  return {
    lang,
    isTs,
    isJsx,
  }
}

function getExpressPlugins(descriptor: SFCDescriptor) {
  const { isTs, isJsx } = checkScriptLang(descriptor)
  const expressionPlugins: CompilerOptions['expressionPlugins'] = []
  if (isTs) {
    expressionPlugins.push('typescript')
  }
  if (isJsx) {
    expressionPlugins.push('jsx')
  }
  return expressionPlugins
}

function isCustomElement(
  filters: boolean | RegExp | undefined | ((filename: string) => boolean),
  filename: string,
) {
  if (typeof filters === 'boolean') {
    return filters
  }
  if (typeof filters === 'function') {
    return filters(filename)
  }
  return filters?.test(filename) || false
}
