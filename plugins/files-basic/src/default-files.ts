import type { FileManager, FileOptions } from '@v-md/core'
import importMapJson from './templates/import-map.json.tmp?raw'
import indexMd from './templates/index.md.tmp?raw'
import mainTs from './templates/main.ts.tmp?raw'
import tsconfigJson from './templates/tsconfig-template.json.tmp?raw'

export function createDefaultFiles(fileManager: FileManager) {
  const { options } = fileManager.editor

  const mainFileOptions: FileOptions = {
    name: 'main.ts',
    content: mainTs,
    keyType: 'main',
  }
  const indexFileOptions: FileOptions = {
    name: 'index.md',
    content: indexMd,
    keyType: 'index',
  }
  const tsconfigFileOptions: FileOptions = {
    name: 'tsconfig.json',
    content: tsconfigJson,
    keyType: 'tsconfig',
  }
  const importMapFileOptions: FileOptions = {
    name: 'import-map.json',
    content: importMapJson.replace(/\{\{\s*CDN_URL\s*\}\}/, options.cdnUrl || ''),
    keyType: 'importMap',
  }

  return [
    mainFileOptions,
    indexFileOptions,
    tsconfigFileOptions,
    importMapFileOptions,
  ]
}
