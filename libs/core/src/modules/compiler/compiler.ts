import type { Node, StringLiteral } from '@babel/types'
import type { CompiledCodeData } from '@v-md/renderer'
import type {
  DynamicImportResolver,
  ImportMap,
  IterableElement,
} from '@v-md/shared'
import type { FileNode } from '../file'
import {
  isLocalPath,
  resolveDynamicImport,
  resolveImportSource,
} from '@v-md/shared'

export class Compiler {
  file: FileNode

  get editor() {
    return this.file.manager.editor
  }

  get logger() {
    return this.editor.logger
  }

  constructor(file: FileNode) {
    this.file = file
  }

  /** 重置编译状态 */
  reset() {
    this.resetSourceCompile()
    this.resetModuleCompile()
  }

  /**
   * 以此文件为入口，完成完整的编译过程
   * @param relativeFiles key - 以此文件为编译入口，涉及到的所有关联文件；value - 该文件是否完成编译
   */
  async compile(
    relativeFiles: Map<FileNode, boolean> = new Map<FileNode, boolean>(),
  ) {
    if (relativeFiles.has(this.file)) {
      // 访问到已完成编译的模块，直接结束即可
      if (relativeFiles.get(this.file)) {
        return relativeFiles
      }

      // 访问到未完成编译的模块，说明存在循环依赖，抛出错误
      throw new Error(`Circular dependency: ${this.file.path.value}`)
    }
    relativeFiles.set(this.file, false)

    await this.file.manager.init()
    await this._compileSource()
    await this._compileModule(relativeFiles)

    relativeFiles.set(this.file, true)

    return relativeFiles
  }

  /** 是否完成源码编译 */
  hasSourceCompiled = false

  /** 源码编译后的 js 代码 */
  js = ''

  /** 源码编译后的 css 代码 */
  css = ''

  /** 额外的 js 代码，每次源码编译完成后都会附加到编译产物 js 的结尾 */
  jsExtra = new Map<string, DynamicImportResolver>()

  /** 额外的 css 代码，每次源码编译完成后都会附加到编译产物 css 的结尾 */
  cssExtra = new Map<string, DynamicImportResolver>()

  /** 重置源码编译状态 */
  resetSourceCompile() {
    if (!this.hasSourceCompiled) {
      return
    }

    this.logger.info(`recompile source code ${this.file.path.value}...`)
    this.hasSourceCompiled = false
    this.js = ''
    this.css = ''
  }

  /** 源码编译 */
  private async _compileSource() {
    if (this.hasSourceCompiled) {
      return
    }

    await this.file.manager.init()
    await this.editor.emit(
      'onFileCompile',
      this,
      this,
      this.file.ext.value,
      this.file.content.value,
    )

    const jsPromises: Promise<string>[] = []
    for (const [, resolver] of this.jsExtra) {
      jsPromises.push(resolveDynamicImport(resolver))
    }
    const jsExtra = await Promise.all(jsPromises).then(res => res.join('\n'))
    this.js += jsExtra

    const cssPromises: Promise<string>[] = []
    for (const [, resolver] of this.cssExtra) {
      cssPromises.push(resolveDynamicImport(resolver))
    }
    const cssExtra = await Promise.all(cssPromises).then(res => res.join('\n'))
    this.css += cssExtra

    this.hasSourceCompiled = true
  }

  /** 是否完成模块编译 */
  hasModuleCompiled = false

  /** 未替换引用源的 js 代码 */
  rawJs = ''

  /** 完成模块编译的 js 代码 */
  moduleJs = ''

  /** 完成模块编译后，内容引用的 Blob url */
  blobUrl = ''

  /** 模块编译时，主动关联该模块的文件 */
  importedFilesBy = new Set<FileNode>()

  /** 记忆引用源位置节点 */
  importSourcePositions = new Set<IterableElement<CompiledCodeData['mem']>>()

  /** 重置模块编译状态 */
  resetModuleCompile() {
    if (!this.hasModuleCompiled) {
      return
    }

    this.logger.info(`recompile modules ${this.file.path.value}...`)
    this.hasModuleCompiled = false
    this.rawJs = ''
    this.moduleJs = ''

    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl)
    }
    this.blobUrl = ''

    this.importSourcePositions.clear()
    const importedFileBy = Array.from(this.importedFilesBy)
    this.importedFilesBy.clear()

    // 引入了此文件的文件，需要重置模块编译状态。
    for (const file of importedFileBy) {
      file.compiler.resetModuleCompile()
    }
  }

  /** 模块编译。 */
  private async _compileModule(
    relativeFiles: Map<FileNode, boolean> = new Map<FileNode, boolean>(),
  ) {
    if (this.hasModuleCompiled) {
      return
    }

    // 注入 CSS 代码
    this._appendCssCode()

    // 没有 js 编译产物，无需处理依赖关系
    if (!this.js) {
      this._compileModuleFinished(this.rawJs)
      return
    }

    await this.file.manager.init()

    const {
      MagicString,
      babelParse,
      walk,
    } = this.file.manager.compilerSfc

    const s = new MagicString(this.rawJs)
    const ast = babelParse(this.rawJs, {
      sourceFilename: this.file.path.value,
      sourceType: 'module',
    }).program.body

    const relativeSourceNodes = new Set<StringLiteral>()

    walk(ast, {
      enter: (node: Node, parent: Node) => {
        let sourceNode: StringLiteral | null = null

        if (
          (
            // 各种 import
            node.type === 'ImportDeclaration' ||
            // export { x } from 'xxx'
            node.type === 'ExportNamedDeclaration' ||
            // export * from 'xxx'
            node.type === 'ExportAllDeclaration'
          ) &&
          node.source
        ) {
          sourceNode = node.source
        }

        // dynamic import
        if (node.type === 'Import' && parent.type === 'CallExpression') {
          const arg = parent.arguments[0]
          // dynamic import 暂时只支持本地路径
          if (arg.type === 'StringLiteral' && isLocalPath(arg.value)) {
            sourceNode = arg
          }
        }

        if (sourceNode) {
          relativeSourceNodes.add(sourceNode)
        }
      },
    })

    const importMap = this.file.manager.keyFiles.importMap?.getJson<ImportMap>() || {}
    for (const node of relativeSourceNodes) {
      const { type, urlSource } = resolveImportSource(importMap, node.value)
      if (type === 'remote-script') {
        continue
      }

      const source = node.value
      let targetFile: FileNode | null = null
      if (type === 'remote-resource') {
        targetFile = await this.file.manager.generateNodeModules(urlSource || '')
      }
      else {
        targetFile = this.file.getNodeByPath(source) ||
          this.file.getNodeByPath(`${source}.ts`) ||
          this.file.getNodeByPath(`${source}.js`) || null
      }

      if (!targetFile) {
        throw new Error(`Import "${source}" in File "${this.file.path.value}" does not exist.`)
      }

      targetFile.compiler.importedFilesBy.add(this.file)
      await targetFile.compiler.compile(relativeFiles)

      this.importSourcePositions.add([node.start!, node.end!, targetFile.path.value])

      s?.overwrite(
        node.start!,
        node.end!,
        JSON.stringify(targetFile.compiler.blobUrl),
      )
    }

    this._compileModuleFinished(s.toString())
  }

  private _appendCssCode() {
    this.rawJs = this.js

    if (!this.css) {
      return
    }

    // 这里使用闭包，是为了防止和源码中的变量冲突
    // 如果不触发源码重新编译，此处的代码不会执行
    const cssInjectCode = `;(() => {
  const id = 'style_${this.file.path.value}'
  let stylesheet = document.getElementById(id)
  if (!stylesheet) {
    stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', id)
    stylesheet.setAttribute('css', '')
    document.head.appendChild(stylesheet)
  }
  const styles = document.createTextNode(${JSON.stringify(this.css)})
  stylesheet.innerHTML = ''
  stylesheet.appendChild(styles)
    })();`

    this.rawJs += `\n${cssInjectCode}`
  }

  private _compileModuleFinished(js: string) {
    this.moduleJs = js
    this.blobUrl = URL.createObjectURL(new Blob([this.moduleJs], { type: 'text/javascript' }))
    this.hasModuleCompiled = true
  }
}
