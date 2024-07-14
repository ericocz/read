class NCX {
    constructor(
        public id: string,
        public title: string,
        public url: string,
        public playOrder: number,
        public children: NCX[] = []
    ) {
        this.id = id
        this.title = title
        this.url = url
        this.playOrder = playOrder
        this.children = children
    }
}

/**
 * 解析.ncx目录文件
 * @param html html字符串
 */
export default function parseNXC(html: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'application/xml')
    return parseNavMap(doc)
}

/**
 * 解析navMap元素
 * @param doc document对象
 * @returns 目录列表
 */
function parseNavMap(doc: Document) {
    const navMap = doc.querySelector('navMap')!
    function getNCXs(navPointList: NodeListOf<Element>): NCX[] {
        let result = <NCX[]>[]
        for (const navPoint of navPointList) {
            const id = navPoint.getAttribute('id')!
            const title = navPoint.querySelector('navLabel')?.textContent?.trim()!
            const url = navPoint.querySelector('content')?.getAttribute('src')!
            const playOrder = Number(navPoint.getAttribute('playOrder')!)
            const navPoints = navPoint.querySelectorAll('navPoint')
            let children = <NCX[]>[]
            if (navPoints.length) {
                children = getNCXs(navPoints)
            }
            result.push(new NCX(id, title, url, playOrder, children))
        }
        return result
    }
    return getNCXs(navMap.querySelectorAll('navMap > navPoint'))
}
