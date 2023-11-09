export interface Provider {
    id: string
    name: string
    url: string
}
export interface ChainAsset {
    id: string,
    name: string,
    slug: string,
    symbol: string
    icon: {
        localFile: any
    },
}
export interface Chain {
    id: string,
    name: string,
    slug: string,
    isTestnet: boolean,
    substrateInfo: {
        symbol: string
    },
    evmInfo: {
        symbol: string
    },
    icon: {
        localFile: any
    },
    providers: Provider[]
}
