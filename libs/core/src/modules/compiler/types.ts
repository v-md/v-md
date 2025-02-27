import type { Compiler } from './compiler'

export type CompileCodeResult = Partial<Pick<Compiler, 'css' | 'js'>>
