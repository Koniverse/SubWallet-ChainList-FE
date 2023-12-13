import React, {useState} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from "../stores";
import ChainService from "../libs/Service/ChainService";
import ChainAssetService from "../libs/Service/ChainAssetService";
import {BuyTokenConfig, ChainAsset, CrowdloanType} from "../types/dataType";
import {addChain} from "../stores/base/ChainStore";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import BuyTokenConfigService from "../libs/Service/BuyTokenConfigService";
import CrowdloanService from "../libs/Service/CrowdloanService";

interface DataContextProviderProps {
    children?: React.ReactElement;
}

type _DataContext = {
    getData: Promise<boolean>;
    isReady?: boolean;
}

export const DataContext = React.createContext({} as _DataContext);

export const DataContextProvider = ({children}: DataContextProviderProps) => {
    const queryClient = new QueryClient();
    const [isReady, setIsReady] = useState(false);
    const getData: Promise<boolean> = new Promise(async (resolve, reject) => {
        const response = await ChainService.find({}, '*', {limit: 1000}, 'ordinal:asc');
        const responseBuyTokens = await BuyTokenConfigService.find({}, '*', {limit: 1000}, 'ordinal:asc');
        const dataBuyTokens = responseBuyTokens.data.map((i) => i.attributes);
        const crowdLoanResponse = await CrowdloanService.find({}, '*', {limit: 1000});
        const dataCrowdLoan = crowdLoanResponse.data.map((i) => i.attributes);

        const responseChainAsset = await ChainAssetService.find({}, {
            'icon': '*',
            'originChain': '*',
            'assetRefs': {
                populate: '*'
            },
        }, {limit: 1000}, 'ordinal:asc');
        const dataChainAssetList = responseChainAsset.data.map((i) => {
            const buyTokenConfig = dataBuyTokens.filter((item: BuyTokenConfig) => item.chain_asset.data.attributes.slug === i.attributes.slug);
            return {...i.attributes, buyTokenConfigs: buyTokenConfig};
        });
        const dataList = response.data.map((i) => {
            const slug = i.attributes.slug;
            const chainAsset = dataChainAssetList.filter((chainAsset: ChainAsset) => chainAsset.originChain.data.attributes.slug === slug);
            const crowdLoanList = dataCrowdLoan.filter((crowdLoan: CrowdloanType) =>
                (crowdLoan.chain.data && crowdLoan.chain.data.attributes.slug === slug) || crowdLoan.relayChain === slug);

            return {...i.attributes, chainAsset, crowdLoanList};
        });
        store.dispatch(addChain(dataList));
        resolve(true);
        setIsReady(true);
    });

    return <Provider store={store}>
        <PersistGate persistor={persistor}>
            <DataContext.Provider value={{getData, isReady}}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </DataContext.Provider>
        </PersistGate>
    </Provider>;
};
