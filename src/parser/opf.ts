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
class Manifest {
    constructor(
        public id: string,
        public href: string,
        public mediaType: string
    ) {
        this.id = id
        this.href = href
        this.mediaType = mediaType
    }
}
class Spine {
    constructor(
        public idref: string,
        public linear: 'yes' | 'no'
    ) {
        this.idref = idref
        this.linear = linear
    }
}

export default function parseOPF(html: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'application/xml')
    return {
        metadata: parseMetaData(doc),
        manifest: parseManifest(doc),
        ...parseSpine(doc)
    }
}

/**
 * 解析OPF文件元数据
 * @param doc document对象
 * @returns MetaData对象
 */
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

/**
 * 解析资源列表
 * @param doc document对象
 * @returns 资源列表
 */
function parseManifest(doc: Document): Manifest[] {
    const items = doc.querySelectorAll('manifest item')
    const result = []
    for (const item of items) {
        const id = item.getAttribute('id')!
        const href = item.getAttribute('href')!
        const mediaType = item.getAttribute('meida-type')!
        result.push(new Manifest(id, href, mediaType))
    }
    return result
}

/**
 * 解析导航顺序
 * @param doc document对象
 * @returns 导航顺序列表
 */
type Dir = 'ltr' | 'trl'
function parseSpine(doc: Document): { dir: Dir; spine: Spine[] } {
    const dir = <Dir>doc.querySelector('spine')?.getAttribute('page-progression-direction')
    const itemRefs = doc.querySelectorAll('spine itemref')
    const result = []
    for (const itemRef of itemRefs) {
        const idref = itemRef.getAttribute('idref')!
        const linear = <'yes' | 'no'>itemRef.getAttribute('linear')
        result.push(new Spine(idref, linear))
    }
    return { dir, spine: result }
}
