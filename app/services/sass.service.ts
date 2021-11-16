import * as sass from 'sass'
import { promisify } from 'util'
import { existsSync, mkdirSync, writeFile } from 'fs'

export async function renderSassAndWriteToPublicDirectory() {
  console.log(`Current directory is ${process.cwd()}`)

  const outputDirectory = 'app/public/styles'

  if (!existsSync(outputDirectory)){
    mkdirSync(outputDirectory)
  }

  const renderPromise = promisify(sass.render)
  const result = await renderPromise({
    file: 'app/styles/common.scss',
    outFile: `${outputDirectory}/common.css`,
    sourceMap: true,
    sourceMapContents: true,
    outputStyle: 'compressed',
    sourceMapRoot: '/styles/common'
  })

  const writeFilePromise = promisify(writeFile)
  await writeFilePromise(`${outputDirectory}/common.css`, result.css, 'utf8')
  await writeFilePromise(`${outputDirectory}/common.css.map`, result.map, 'utf8')
}