export interface Chain {
    id: string
    name: string
    slug: string
    substrateInfo: {
        symbol: string
    },
    evmInfo: {
        symbol: string
    },
    icon: {
        localFile: any
    }
}
