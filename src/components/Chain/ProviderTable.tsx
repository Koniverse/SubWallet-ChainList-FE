import {Button, Icon} from "@subwallet/react-ui";
import * as React from "react";
import {Chain, ConnectionStatus, Provider} from "../../types/dataType";
import styled from "styled-components";
import {ThemeProps} from "../../types";
import CN from "classnames";
import {AddressBook, ShareNetwork} from "phosphor-react";
import ProviderConnectionStatus from "../ProviderConnectionStatus";
import {useTranslation} from "react-i18next";
import useApiPromiseData from "../../hooks/useApiPromiseData";
import {convertHexColorToRGBA} from "../../libs";
import ButtonBackground from "../../Button/ButtonBackground";
import Table, {ColumnsType} from "@subwallet/react-ui/es/table";
import {useMemo} from "react";

interface Props extends ThemeProps {
    chain: Chain
    searchInput?: string
}

const Component = ({chain, searchInput, className}: Props) => {
    const urls = chain && chain.providers.length > 0 ? chain.providers.map((provider) => provider.url) : [];
    const providerConnectionStatus = useApiPromiseData(urls);
    const {t} = useTranslation();
    const filteredList = useMemo(() => {
        return chain && chain.providers.filter((item) => {
            if (!searchInput) {
                return true;
            }
            return item.name.toLowerCase().includes(searchInput.toLowerCase());
        }).map((item, index) => {
            return {
                ...item,
                key: index
            }
        })
    }, [searchInput, chain]);
    const columns: ColumnsType<Provider> = [
        {
            title: t('Provider name'),
            render: (item: Provider) => {
                let value = {
                    status: ConnectionStatus.CHECKING
                }

                if (providerConnectionStatus && item) {
                    const queryValue = providerConnectionStatus.find((i: any) => i.data && i.data.url === item.url);
                    value = queryValue ? queryValue.data : value;
                }
                const classNameButton = CN('provider-button-first', value.status && value.status.toString().toLowerCase());
                return (
                    <>
                        <div className="__item-share">
                            <Button
                                icon={(
                                    <Icon
                                        phosphorIcon={ShareNetwork}
                                        size={'sm'}
                                        weight={'fill'}
                                        className={classNameButton}
                                    />
                                )}
                                shape={'circle'}
                                type='ghost'
                                size={'xs'}
                            />
                            <span className="__item-name">
                                {item.name}
                            </span>
                        </div>
                    </>
                )
            },
        },
        {
            title: t('Connection status'),
            render: (item: Provider) => {
                let value = {
                    status: ConnectionStatus.CHECKING
                }

                if (providerConnectionStatus && item) {
                    const queryValue = providerConnectionStatus.find((i: any) => i.data && i.data.url === item.url);
                    value = queryValue ? queryValue.data : value;
                }
                return (
                    <ProviderConnectionStatus status={value.status}/>
                )
            },
        },
        {
            title: t('URL'),
            dataIndex: 'url',
            key: 'url',
            render: (url: string) => {
                return (
                    <span className='__item-url'>{url}</span>
                )
            },
        },
        {
            title: t('Action'),
            key: 'action',
            render: () => (
                <>
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
                </>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={filteredList} className={className} pagination={false}/>
        </>
    )
}

const ProviderTable = styled(Component)<ThemeProps>(({theme: {extendToken, token}}: ThemeProps) => {
        return {
            '.ant-table .ant-table-content table .ant-table-thead .ant-table-cell': {
                textAlign: 'left',
            },
            '.ant-table .ant-table-content table .ant-table-row .ant-table-cell': {
                textAlign: 'left',
            },
            '@media (max-width: 615px)': {
                    '.__item-url': {
                        display: 'inline-block',
                        width: 200
                    }
              },
            '.__item-share': {
                display: 'inline-flex',
                alignItems: 'center',
            },
            '.__item-name': {
                marginLeft: 12
            },
            '.provider-button-first': {
                borderRadius: '50%',
                width: 32,
                height: 32,
                '&.connected': {
                    color: '#4CEAAC',
                    backgroundColor: 'rgba(76, 234, 172, 0.1)'
                },

                '&.checking': {
                    color: token['gold-6'],
                    backgroundColor: convertHexColorToRGBA(token['gray-6'], 0.1)
                },
                '&.fail': {
                    color: '#E11A1A',
                    backgroundColor: 'rgba(191, 22, 22, 0.1)'
                },
            },
        }
    }
);
export default ProviderTable;
