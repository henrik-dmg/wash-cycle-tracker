import * as sass from 'sass'
import { promisify } from 'util'
import { writeFile } from 'fs'

export async function renderSassAndWriteToPublicDirectory() {
  console.log(`Current directory is ${process.cwd()}`)

  const renderPromise = promisify(sass.render)
  const result = await renderPromise({
    file: 'app/styles/common.scss',
    outFile: 'app/public/styles/common.css',
    sourceMap: true,
    sourceMapContents: true,
    outputStyle: 'compressed',
    sourceMapRoot: '/styles/common'
  })

  const writeFilePromise = promisify(writeFile)
  await writeFilePromise('app/public/styles/common.css', result.css, 'utf8')
  await writeFilePromise('app/public/styles/common.css.map', result.map, 'utf8')
}