import * as sass from 'sass'
import { promisify } from 'util'
import { writeFile } from 'fs'

export async function renderSassAndWriteToPublicDirectory() {
  const renderPromise = promisify(sass.render)
  const result = await renderPromise({
    file: `${process.cwd()}/app/styles/common.scss`,
    outFile: `${process.cwd()}/app/public/styles/common.css`
  })

  const writeFilePromise = promisify(writeFile)
  await writeFilePromise(`${process.cwd()}/app/public/styles/common.css`, result.css, 'utf8')
}