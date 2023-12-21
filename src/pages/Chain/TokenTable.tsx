import {ThemeProps} from "../../types";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import DetailTable from "./DetailTable";
import {useTranslation} from "react-i18next";
import { Icon, ModalContext} from "@subwallet/react-ui";
import {AddressBook} from "phosphor-react";
import {ChainAsset} from "../../types/dataType";
import {TokenPrice} from "../../components/Token/TokenPrice";
import {TokenItem} from "../../components/Token/TokenItem";
import axios from "axios";
import {URL_DATA_GET_PRICE_TOKEN} from "../../libs/utils/constant";
import {TokenDetailModal} from "./TokenDetailModal";
import CN from "classnames";
import ButtonBackground from "../../Button/ButtonBackground";
import {TablePaginationConfig} from "@subwallet/react-ui/lib";

type Props = ThemeProps & {
    chainAssetList: ChainAsset[];
    searchInput?: string;
    chainSlug?: string;
    pagination?: TablePaginationConfig | false
};
const TokenDetailModalId = 'tokenDetailModalId';

const Component = ({chainAssetList, searchInput, chainSlug, className, pagination}: Props) => {
    const {t} = useTranslation();
    const {activeModal, inactiveModal} = useContext(ModalContext);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [tokenDetail, setTokenDetail] = useState<ChainAsset | undefined>(undefined);
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
                    setPastPrice(current_price - price_change_24h);
                }
            } catch (e) {
                return;
            }
        }
        getDataPrice();
    }, [chainSlug]);
    const onCloseDetail = useCallback(() => {
        setTokenDetail(undefined);
        inactiveModal(TokenDetailModalId);
    }, [inactiveModal]);
    let onClickItem = (item: ChainAsset) => {
        setTokenDetail(item);
        activeModal(TokenDetailModalId);
    };
    return (
        <div className={CN(className)}>
            <DetailTable
                columns={[
                    {
                        title: t<string>('Tokens'),
                        dataIndex: 'token',
                        key: 'token',
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
                        dataIndex: 'tokenName',
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
                                <ButtonBackground
                                    icon={(
                                        <Icon
                                            phosphorIcon={AddressBook}
                                            size={'xs'}
                                            weight={'fill'}
                                        />
                                    )}
                                    shape={'circle'}
                                    type='primary'
                                    size={'xs'}
                                />
                            );
                        }
                    },
                ]}
                dataSource={filteredList}
                onClick={onClickItem}
                pagination={pagination ?? false}
            />
            {tokenDetail && <TokenDetailModal
                tokenDetail={tokenDetail}
                id={TokenDetailModalId}
                onCancel={onCloseDetail}
                currentPrice={currentPrice}
                pastPrice={pastPrice}
            />}
        </div>
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

        '.ant-table-wrapper .ant-pagination ': {
            '.ant-pagination-item': {
                display: "none",
            },
            '.ant-pagination-prev': {
                'button': {
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)'
                }
            },
            '.ant-pagination-next': {
                'button': {
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)'
                }
            }
        }
    }
});
export default TokenTable;
