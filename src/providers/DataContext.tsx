import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import { persistor, store} from "../stores";
import ChainService from "../libs/Service/ChainService";
import ChainAssetService from "../libs/Service/ChainAssetService";
import {ChainAsset} from "../types/dataType";
import {addChain} from "../stores/base/ChainStore";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

interface DataContextProviderProps {
    children?: React.ReactElement;
}

type _DataContext = {
    getData: Promise<boolean>;
}

export const DataContext = React.createContext({} as _DataContext);

export const DataContextProvider = ({children}: DataContextProviderProps) => {
    const queryClient = new QueryClient()
    const getData: Promise<boolean> = new Promise(async (resolve, reject) => {
        const response = await ChainService.find({}, '*', {limit: 1000}, 'ordinal:asc');
        const responseChainAsset = await ChainAssetService.find({}, '*', {limit: 1000});
        const dataChainAssetList = responseChainAsset.data.map((i) => i.attributes);
        const dataList = response.data.map((i) => {
            const chainAsset = dataChainAssetList.filter((chainAsset: ChainAsset) => chainAsset.originChain.data.attributes.slug === i.attributes.slug);
            // console.log('chainAsse/t', chainAsset)

            return {...i.attributes, chainAsset};
        });
        store.dispatch(addChain(dataList));
        resolve(true);
    });

    return <Provider store={store}>
        <PersistGate persistor={persistor}>
            <DataContext.Provider value={{getData}}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </DataContext.Provider>
        </PersistGate>
    </Provider>;
};
