import {TagProps} from "@subwallet/react-ui";
import {IconProps} from "phosphor-react";
import React from "react";

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
    originChain: {
        data: {
            attributes: Chain,
            id: number
        }
    },
    icon: {
        data: {
            attributes: {
                url: string
            }
        }
    },
    assetType: string,
}
export interface Chain {
    id: string,
    name: string,
    slug: string,
    isTestnet: boolean,
    symbol: string,
    icon: {
        data: {
            attributes: {
                url: string
            }
        }
    },
    substrateInfo: {
        symbol: string,
        relaySlug: string,
        paraId: number,
        genesisHash: string,
        addressPrefix: string,
        chainType: string,
        crowdloanParaId: number,
        crowdloanUrl: string,
        blockExplorer: string,
        decimals: number,
        existentialDeposit: string,
        hasNativeNft: boolean,
        supportStaking: boolean,
        supportSmartContract: any
    },
    evmInfo: {
        symbol: string,
        evmChainId: number,
        decimals: number,
        blockExplorer: string,
        apiExplorer: string,
        existentialDeposit: string,
        supportSmartContract: any
    },
    providers: Provider[],
    chainAsset: ChainAsset[]
}


export enum ConnectionStatus {
    CONNECTED = 'CONNECTED',
    FAIL = 'FAIL',
    CHECKING = 'CHECKING',
}

export interface ProviderCollection {
    url: string;
    status: ConnectionStatus;
}


export enum ChainType {
    EVM = 'EVM',
    SUBSTRATE = 'SUBSTRATE',
}

export interface ChainTagType {
    label: string;
    icon: React.ReactNode;
    color: TagProps['color'];
    weight: IconProps['weight'];
}
export interface ProviderConnectionType {
    label: string;
    color: TagProps['color'];
}
export interface DataType {
    id: number;
    attributes: any;
}
export interface ResponseDataType {
    data: DataType[]
}
