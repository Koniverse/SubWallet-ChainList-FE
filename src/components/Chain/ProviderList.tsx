import {Button, Icon, SwList, Typography} from "@subwallet/react-ui";
import * as React from "react";
import {Chain, ConnectionStatus} from "../../types/dataType";
import {useCallback, useState} from "react";
import styled from "styled-components";
import {ThemeProps} from "../../types";
import CN from "classnames";
import {PlusCircle, ShareNetwork} from "phosphor-react";
import ProviderConnectionStatus from "../ProviderConnectionStatus";
import {useTranslation} from "react-i18next";
import useApiPromiseData from "../../hooks/useApiPromiseData";
import {convertHexColorToRGBA} from "../../libs";

interface Props extends ThemeProps {
    chain: Chain
}

const Component = ({chain, className}: Props) => {
    const urls = chain && chain.providers.length > 0 ? chain.providers.map((provider) => provider.url) : [];
    const providerConnectionStatus = useApiPromiseData(urls)
    const {t} = useTranslation();
    const [searchInput, ] = useState<string>('');
    const filterFunction = useCallback((item: any) => {
        return true;
    }, []);
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
    const renderEarningItem = useCallback((item: any) => {
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
                renderItem={renderEarningItem}
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
                backgroundColor: extendToken.boxBackgroundColor,
                '.__provider-content': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    '.__item-data': {
                        display: 'flex',
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
