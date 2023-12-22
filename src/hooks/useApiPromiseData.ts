import {ApiPromise, WsProvider} from "@polkadot/api";
import {useQueries} from "@tanstack/react-query";
import {useCallback} from "react";
import {ProviderInterface} from "@polkadot/rpc-provider/types";
import {getSubstrateConnectProvider} from "../libs";
import {ConnectionStatus, ProviderCollection} from "../types/dataType";

const restartInterval = 1000 * 60;


const getData = async (url: string) => {
    let provider: ProviderInterface | null = null;
    try {
        if (url.startsWith('light://')) {
            provider = getSubstrateConnectProvider(url.replace('light://substrate-connect/', ''));
            if (!provider) {
                return {
                    url, status: ConnectionStatus.FAIL
                } as ProviderCollection;
            }
            await provider.connect();
        } else {
            provider = new WsProvider(url);
        }
        await ApiPromise.create({provider});
        await provider.disconnect();
        return {
            url, status: ConnectionStatus.CONNECTED
        } as ProviderCollection;
    } catch (e) {
        return {
            url, status: ConnectionStatus.FAIL
        } as ProviderCollection;
    }

}

const useSocketQuery = (url: string) => {
    return {
        queryKey: [url],
        queryFn: () => getData(url),
        select: useCallback((data: ProviderCollection) => data, []),
        refetchInterval: restartInterval,
    };
};

const useRPCData = (urls: string[]): any => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const queries = urls?.map((url) => useSocketQuery(url));

    // @ts-ignore
    return useQueries({queries});
};
export default useRPCData;
