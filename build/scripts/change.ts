import { writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { argv } from 'node:process'
import { glob } from 'glob'
import { readPackage } from 'read-pkg'
import { simpleGit } from 'simple-git'

const [
  ,,
  cwd = '',
  mode = 'patch',
] = argv

const git = simpleGit({
  config: [
    `user.email=p_openx`,
    `user.name=openx1@huawei.com`,
    'http.sslVerify=false',
    'https.sslVerify=false',
  ],
})

await git.fetch().then(console.log.bind(null, 'fetch finished\n'))

let files: string[] = []
if (cwd === '') {
  files = await glob(['libs/*', 'plugins/*', 'websites/*'])
}
else {
  files = [cwd]
}
const packages = files.map(file => basename(file))

for (let i = 0; i < packages.length; i++) {
  const pkg = packages[i]
  const pkgPath = files[i].replace(/\\/g, '/')

  try {
    const { name, version } = await readPackage({ cwd: pkgPath })
    const res = await git.log(
      version === '0.0.0' ?
          ['--stat'] :
          [`${name}@${version}..HEAD`, '--stat'],
    )
    const changes = res.all
      .filter(
        log => !log.message.startsWith('merge') &&
          !log.message.startsWith('Merge') &&
          !log.message.startsWith('update sahoc'),
      )
      .filter((log) => {
        const files = log.diff?.files || []
        return files.some(f => f.file.startsWith(pkgPath))
      })
      .map(log => log.message)
      .join('\n')

    if (changes) {
      const header = `---\n"${name}": ${mode}\n---\n\n`
      const filePath = join('.changeset', `changeset-${pkg}-${new Date().getTime()}.md`)
      await writeFile(filePath, `${header}${changes}`, 'utf-8')
    }
  }
  catch (e) {
    console.error(`处理 ${pkg} 时出现错误`, e)
  }
}
