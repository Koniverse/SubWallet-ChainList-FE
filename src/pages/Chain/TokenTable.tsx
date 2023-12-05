import {ThemeProps} from "../../types";
import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import DetailTable from "./DetailTable";
import {useTranslation} from "react-i18next";
import {Button, Icon} from "@subwallet/react-ui";
import {PlusCircle} from "phosphor-react";
import {ChainAsset} from "../../types/dataType";
import {TokenPrice} from "../../components/Token/TokenPrice";
import {TokenItem} from "../../components/Token/TokenItem";
import axios from "axios";
import {URL_DATA_GET_PRICE_TOKEN} from "../../libs/utils/constant";

type Props = ThemeProps & {
    chainAssetList: ChainAsset[];
    searchInput?: string;
    chainSlug?: string;
};

const Component = ({chainAssetList, searchInput, chainSlug}: Props) => {
    const {t} = useTranslation();
    const [currentPrice, setCurrentPrice] = useState(0);
    const [pastPrice, setPastPrice] = useState(0);
    const filteredList = useMemo(() => {
        return chainAssetList && chainAssetList.filter((item) => {
            if (!searchInput) {
                return true;
            }
            return item.name.toLowerCase().includes(searchInput.toLowerCase());
        })
    }, [chainAssetList, searchInput]);
    useEffect(() => {
        const getDataPrice = async () => {
            const url = `${URL_DATA_GET_PRICE_TOKEN}${chainSlug}`;
            try {
                const response = await axios.get(url);
                if (response.data && response.data.length > 0) {
                    const {current_price, price_change_24h} = response.data[0];
                    setCurrentPrice(current_price);
                    setPastPrice(current_price + price_change_24h);
                }
            }catch (e) {
                return;
            }
        }
        getDataPrice();
    }, [chainSlug]);
    let onClickItem = (item: any) => {

    };
    return (
        <>
            <DetailTable
                columns={[
                    {
                        title: t<string>('Tokens'),
                        dataIndex: 'name',
                        key: 'name',
                        render: (_, row) => {
                            return (
                                <TokenItem
                                    key={row.slug}
                                    url={row.icon.data.attributes.url}
                                    slug={row.slug}
                                    symbol={row.symbol}
                                />
                            );
                        }
                    },
                    {
                        title: t<string>('Token name'),
                        dataIndex: 'numberProviders',
                        className: '__center-col',
                        render: (_, row) => {
                            return (
                                <>{row.name}</>
                            );
                        }
                    },
                    {
                        title: 'Token type',
                        dataIndex: 'type',
                        key: 'type',
                        className: '__center-col',
                        render: (_, row) => {
                            return (
                                <>{row.assetType}</>
                            );
                        }
                    },

                    {
                        title: t<string>('Price'),
                        dataIndex: 'price',
                        key: 'price',
                        className: '__center-col',
                        render: (_, row) => {
                            return (
                                <TokenPrice
                                    pastValue={pastPrice}
                                    value={currentPrice}
                                />
                            );
                        }
                    },

                    {
                        render: (_, row) => {
                            return (


                                <Button
                                    icon={(
                                        <Icon
                                            phosphorIcon={PlusCircle}
                                            size={'sm'}
                                            weight={'fill'}
                                        />
                                    )}
                                    shape={'circle'}
                                    type='ghost'
                                    size={'xs'}
                                />
                            );
                        }
                    },
                ]}
                dataSource={filteredList}
                onClick={onClickItem}
            />
        </>
    )
}


const TokenTable = styled(Component)<ThemeProps>(({theme: {extendToken, token}}: ThemeProps) => {
    return {
        '.ant-table .ant-table-content table .ant-table-thead .ant-table-cell.__center-col': {
            textAlign: 'center'
        },
        '.ant-table .ant-table-content table .ant-table-row .ant-table-cell.__center-col': {
            textAlign: 'center'
        },
    }
});
export default TokenTable;
