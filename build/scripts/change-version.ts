import { argv } from 'node:process'
import { readPackage } from 'read-pkg'
import { $ } from 'zx'

const [
  ,,
  cwd = 'websites/playground',
] = argv

await $`npx changeset version`

/** 获取更新后的版本 */
const { name, version } = await readPackage({ cwd })

// 输出版本信息到环境变量
console.log(`::set-output name=tag_version::${name}@${version}`)
console.log(`::set-output name=final_version::${version}`)
