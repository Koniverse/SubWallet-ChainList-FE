import {ApiPromise, WsProvider} from "@polkadot/api";
import {useQueries} from "@tanstack/react-query";
import {useCallback} from "react";
import {ProviderInterface} from "@polkadot/rpc-provider/types";
import {getSubstrateConnectProvider} from "../libs/lightSubstrateConnect";
import {ConnectionStatus, ProviderCollection} from "../types/dataType";

const restartInterval = 1000 * 60;


const getData = async (url: string) => {
    return new Promise<ProviderCollection>(async (resolve) => {

        try {
            let provider: ProviderInterface | null = null;

            if (url.startsWith('light://')) {
                provider = getSubstrateConnectProvider(url.replace('light://substrate-connect/', ''));
                if (provider) {
                    await provider.connect();
                }
            } else {
                provider = new WsProvider(url);
            }
            if (!provider) {
                return resolve({
                    url, status: ConnectionStatus.FAIL
                } as ProviderCollection);
            }
            const api = await ApiPromise.create({provider});
            let count = 0;
            // @ts-ignore
            const unsubscribe = await api.rpc.chain.subscribeNewHeads((header: any) => {
                if (++count === 1) {
                    unsubscribe();
                }
                resolve({
                    url, status: ConnectionStatus.CONNECTED
                } as ProviderCollection);
            });
        } catch (e) {
            return resolve({
                    url, status: ConnectionStatus.FAIL
                } as ProviderCollection);
        }
    });

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
