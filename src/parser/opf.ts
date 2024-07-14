import X2JS from 'x2js'

class MetaData {
    title = '' // 电子书的标题
    creator = '' // 电子书的责任者，即主要作者
    subject = '' // 主题词或关键词，描述电子书的主题或内容
    description = '' // 对电子书内容的描述
    publisher = '' // 出版商
    date = '' // 出版日期或修改日期
    identifier = '' // 唯一标识符，如ISBN
    language = '' // 电子书使用的语言
    rights = '' // 版权信息
}

export default async function parseOPF(html: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'application/xml')
    parseMetaData(doc)
}

function parseMetaData(doc: Document): MetaData {
    const metadata = doc.querySelector('metadata')!
    const resultObj = new MetaData()
    const x2js = new X2JS()
    const metadataJSON = x2js.xml2js(metadata.outerHTML)! as {
        metadata: object
    }
    for (const [key, value] of Object.entries(metadataJSON.metadata)) {
        if (Object.hasOwnProperty.call(resultObj, key)) {
            // @ts-ignore
            resultObj[key] = value.toString()
        }
    }
    return resultObj
}
