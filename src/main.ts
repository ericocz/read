const start = new Date().getTime()
import fileExtension from 'file-extension'
import unzip from './utils/unzip'
import { isOPF, isNCX } from './utils/file-type'
import parseOPF from './parser/opf'
import parseNXC from './parser/ncx'

window.onload = async () => {
    const allFiles = await unzip('src/books/重构.epub')
    const opfFile = allFiles.find((file) => isOPF(fileExtension(file.name)))
    const ncxFile = allFiles.find((file) => isNCX(fileExtension(file.name)))
    if (opfFile) {
        const opf = parseOPF(await opfFile.async('string'))
        console.log(opf)
    }
    if (ncxFile) {
        const ncx = parseNXC(await ncxFile.async('string'))
        console.log(ncx)
    }
    const end = new Date().getTime()
    document.write(`耗时：${end - start}`)
}
