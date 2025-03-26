import type { FileExtInfo } from '@v-md/core'
import { resolveAudioExt } from './audio'
import { resolveDocExt } from './doc'
import { resolveFontExt } from './font'
import { resolveImageExt } from './image'
import { resolveVideoExt } from './video'

export function getStaticAssetsExtInfo(info: Record<string, FileExtInfo>) {
  resolveImageExt(info)
  resolveAudioExt(info)
  resolveVideoExt(info)
  resolveDocExt(info)
  resolveFontExt(info)
  return info
}
