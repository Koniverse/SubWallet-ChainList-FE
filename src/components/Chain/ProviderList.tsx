import {Button, Icon, SwList, Typography} from "@subwallet/react-ui";
import * as React from "react";
import {Chain, ConnectionStatus, Provider} from "../../types/dataType";
import {useCallback} from "react";
import styled from "styled-components";
import {ThemeProps} from "../../types";
import CN from "classnames";
import {AddressBook, ShareNetwork} from "phosphor-react";
import ProviderConnectionStatus from "../ProviderConnectionStatus";
import {useTranslation} from "react-i18next";
import useApiPromiseData from "../../hooks/useApiPromiseData";
import {convertHexColorToRGBA} from "../../libs";
import ButtonBackground from "../../Button/ButtonBackground";

interface Props extends ThemeProps {
    chain: Chain
    searchInput?: string
}

const Component = ({chain, searchInput, className}: Props) => {
    const urls = chain && chain.providers.length > 0 ? chain.providers.map((provider) => provider.url) : [];
    const providerConnectionStatus = useApiPromiseData(urls);
    // console.log('providerConnectionStatus', providerConnectionStatus)

    const {t} = useTranslation();
    const filterFunction = useCallback((item: Provider) => {
        if (!searchInput) return true;
        return item.name.toLowerCase().includes(searchInput.toLowerCase());
    }, [searchInput]);
    const searchFunction = useCallback((item: any) => {
        return true;
    }, []);
    const renderWhenEmpty = useCallback(() => {
        return (
            <div className={'__empty'}>
                <Typography.Text>
                    {t('No providers found')}
                </Typography.Text>
            </div>
        );
    }, [t]);
    const renderItem = useCallback((item: any) => {
        let value = {
            status: ConnectionStatus.CHECKING
        }
        if (providerConnectionStatus && item) {
            const queryValue = providerConnectionStatus.find((i: any) => i.data && i.data.url === item.url);
            value = queryValue ? queryValue.data : value;
        }
        const classNameButton = CN('provider-button-first', value.status && value.status.toString().toLowerCase());

        return (
            <div className={'__item_provider'} key={item.url}>
                <div className="__provider-content">
                    <div className="__item-data">
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
                        </div>
                        <div className="__item-value">
                            <div className="__item-endpoint">
                                <Typography.Text className={'__item_name'}>
                                    {item.name}
                                </Typography.Text>
                                <ProviderConnectionStatus status={value.status}/>
                            </div>
                            <div className="__item-url">
                                <Typography.Text>
                                    {item.url}
                                </Typography.Text>
                            </div>
                        </div>
                    </div>
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
                </div>
            </div>
        );
    }, [providerConnectionStatus]);

    return (
        <>
            <SwList
                className={CN(className, '__list-container')}
                displayGrid={true}
                filterBy={filterFunction}
                gridGap={'8px'}
                list={chain.providers}
                minColumnWidth={'360px'}
                renderItem={renderItem}
                renderOnScroll={true}
                renderWhenEmpty={renderWhenEmpty}
                searchBy={searchFunction}
                searchMinCharactersCount={1}
                searchTerm={searchInput}
            />
        </>
    )
}

const ProviderList = styled(Component)<ThemeProps>(({theme: {extendToken, token}}: ThemeProps) => {
        return {

            '.__item_provider': {
                padding: '12px 8px 12px 16px',
                marginBottom: 12,
                backgroundColor: token.colorBgSecondary,
                '.__provider-content': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '.__item-data': {
                        display: 'flex',
                        alignItems: 'center',
                        '.__item-share': {
                            marginRight: 12,

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
                        },
                        '.__item-value': {
                            display: 'flex',
                            flexDirection: 'column',
                            '.__item-endpoint': {
                                '.__item_name': {
                                    fontSize: token.fontSizeLG,
                                    lineHeight: token.lineHeightLG,
                                    fontWeight: 600,
                                    marginRight: 8,
                                }
                            },
                            '.__item-url': {
                                width: 264,
                            }

                        }
                    }
                },
            }
        }
    }
);
export default ProviderList;
