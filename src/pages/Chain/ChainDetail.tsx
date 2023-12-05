import React, {
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AppContext} from "../../providers/AppStateProvider";
import {useTranslation} from "react-i18next";
import {ThemeProps} from "../../types";
import {Button, Icon, Image, Typography} from "@subwallet/react-ui";
import PageWrapper from "../../components/Layout/PageWrapper";
import styled from "styled-components";
import Logo2D from "../../components/Logo/Logo2D";
import TokenTable from './TokenTable';
import {Chain, ChainType} from "../../types/dataType";
import NetworkType from "../../components/Icon/NetworkType";
import {useSelector} from "react-redux";
import {RootState} from "../../stores";
import ProviderList from "../../components/Chain/ProviderList";
import {MagnifyingGlass} from "phosphor-react";
import Search from "../../components/Search";

interface ChainDetailType extends Chain {
    addressPrefix: string,
    crowdloanUrl: string,
    blockExplorer: string,
    decimals: number,
    symbol: string,
    paraId: number,
    type: ChainType
}


const Component = () => {
    const {slug} = useParams();
    const {chainList} = useSelector((state: RootState) => state.chainStore);
    const {t} = useTranslation();
    const {setShowBackButtonOnHeader, setOnBack, setTitle} = useContext(AppContext);
    const [searchInput, setSearchInput] = useState<string>('');
    const handleSearch = useCallback((value: string) => setSearchInput(value), [setSearchInput]);
    const navigate = useNavigate();
    const [chain, setChain] = useState<ChainDetailType>({} as ChainDetailType)
    useEffect(() => {
        const getChain = async () => {
            const chainData = chainList.find((chain) => chain.slug === slug);
            const newChain: ChainDetailType = {...chainData} as ChainDetailType;
            if (chainData) {
                if (chainData.substrateInfo) {
                    newChain.addressPrefix = chainData.substrateInfo.addressPrefix;
                    newChain.crowdloanUrl = chainData.substrateInfo.crowdloanUrl;
                    newChain.blockExplorer = chainData.substrateInfo.blockExplorer;
                    newChain.decimals = chainData.substrateInfo.decimals;
                    newChain.symbol = chainData.substrateInfo.symbol;
                    newChain.paraId = chainData.substrateInfo.paraId;
                    newChain.type = ChainType.SUBSTRATE;
                }
                if (chainData.evmInfo) {
                    newChain.blockExplorer = chainData.evmInfo.blockExplorer;
                    newChain.decimals = chainData.evmInfo.decimals;
                    newChain.symbol = chainData.evmInfo.symbol;
                    newChain.type = ChainType.EVM;
                }
                setChain(newChain)
            }
        }
        setTitle(t('Chain Detail'));
        setShowBackButtonOnHeader(true);
        setOnBack(goBack);
        getChain();
    }, [slug, chainList]);
    const goBack = () => {
        navigate('/');
    }
    return (
        <div className={'__chain-detail'}>
            <div className={'__chain-info'}>
                <div className={'__item-data'}>
                    <div className="__item-icon">
                        {chain.icon && (
                            <Image
                                height={96}
                                src={chain.icon.data.attributes.url}
                                width={96}
                            />
                        )
                        }
                    </div>
                    <div className="__item-info">
                        <div className='__item-title'>
                            <Typography.Title level={4}>{chain.name}</Typography.Title>
                        </div>

                        <div className={'__item-group'}>
                            <div className='__item-group-data'>
                                Chain ID:
                                <span className="__item-value">
                                    {chain.id}
                                </span>
                            </div>
                            <div className='__item-group-data'>
                                Address prefix: {chain.addressPrefix}
                            </div>
                            <div className='__item-group-data'>
                                ParaID:
                                <span className="__item-value">
                                    {chain.paraId}
                                </span>
                            </div>
                        </div>
                        <div className={'__item-group'}>
                            <div className='__item-group-data'>
                                Type:
                                <span className="__item-type">
                                    <NetworkType type={chain.type}/>
                                </span>
                            </div>
                            <div className='__item-group-data'>
                                Decimals:
                                <span className="__item-value">
                                    {chain.decimals}
                                </span>
                            </div>
                            <div className='__item-group-data'>
                                Symbol:
                                <span className="__item-value">
                                    {chain.symbol}
                                </span>
                            </div>
                        </div>
                        <div className={'__item-group'}>
                            <div className='__item-group-data'>
                                Block explorer:
                                <span className="__item-value">
                                    {chain.blockExplorer}
                                </span>
                            </div>
                            <div className='__item-group-data'>
                                Crowdloan URL:

                                <span className="__item-value">
                                    {chain.crowdloanUrl}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'__item-button'}>
                    <Button
                        icon={<Logo2D/>}
                        className={'__button_connect'}
                    >
                        {t('Add to wallet')}
                    </Button>
                </div>
            </div>
            <div className="__data-list">
                <div className='__token_list'>
                    <div className="__token_header">
                        <div className="__token_title">
                            <Typography.Title level={4}>{t('Token list')}</Typography.Title>
                        </div>
                        <div className="__token_search">
                            <Search
                                actionBtnIcon={(
                                    <Icon
                                        phosphorIcon={MagnifyingGlass}
                                        size='sm'
                                    />
                                )}
                                onClickActionBtn={() => {
                                }}
                                onSearch={handleSearch}
                                placeholder={t('Token name ...')}
                                searchValue={searchInput}
                                showActionBtn
                            />
                        </div>
                    </div>
                    <div className="__items token-table">
                        <TokenTable chainAssetList={chain.chainAsset}
                                    searchInput={searchInput}
                                    chainSlug={slug}
                        />
                    </div>
                </div>
                <div className="__providers_list">
                    <div className="__providers_header">
                        <div className="__providers_title">
                            <Typography.Title level={4}>{t('Providers')}</Typography.Title>
                        </div>
                        <div className="__providers_content">
                            {chain.providers && <ProviderList chain={chain}/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
type Props = ThemeProps;

function WrapperComponent({className = ''}: ThemeProps): React.ReactElement<Props> {

    return (
        <PageWrapper
            className={`chain-detail ${className}`}
        >
            <Component/>
        </PageWrapper>
    );
}

const ChainDetail = styled(WrapperComponent)<ThemeProps>(({theme: {extendToken, token}}: ThemeProps) => {
    return {
        '.__chain-detail': {
            overflow: 'hidden',
            height: '100%',
        },
        '.__chain-info': {
            display: 'flex',
            padding: '40px',
            flexDirection: 'row',
            alignItems: 'self-start',
            justifyContent: 'space-between',
            backgroundColor: extendToken.boxBackgroundColor,
            marginBottom: '24px',
            borderRadius: '8px',
            '& > div': {
                color: '#fff',
            },
            '.__item-data': {
                display: 'flex',
            },
            '.__item-icon': {
                marginRight: '24px',
            },
            '.__item-group': {
                display: 'flex',
                gap: '12px',
                justifyContent: 'space-between',
                marginBottom: '8px',
            },
            '.__button_connect': {
                width: '240px',
                height: '52px',
                padding: '16px',
                borderRadius: '32px',
                gap: '8px'
            },
            '.__item-title': {
                marginBottom: '8px',
                'h4.ant-typography': {
                    fontSize: '24px',
                    margin: 0,
                }
            },
            '.__item-group-data': {
                display: 'flex',
                fontSize: '16px',
                lineHeight: '24px',
                minWidth: 300,
                fontWeight: 600,
                color: '#FFFFFFD9',
                '.__item-value': {
                    fontWeight: 500,
                    color: '#FFFFFFA6',
                    marginLeft: '12px',
                },
                '.__item-type': {
                    marginLeft: '12px',
                    display: 'flex',
                }
            },
        },
        '.__data-list': {
            display: 'flex',

            '.__token_list': {
                display: 'flex',
                flexDirection: 'column',
                flex: 2,
                marginRight: '64px',
                '.__token_header': {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    '.__token_title h4.ant-typography': {
                        fontSize: '24px',
                        margin: 0,
                    },


                    '.right-section': {
                        '.search-input': {
                            width: 264,
                            height: 40,
                            borderRadius: 20,
                            '.ant-input': {
                                paddingTop: 9,
                                paddingBottom: 9,
                                height: 40,
                            },
                            '.ant-input-suffix': {
                                height: 40,
                            },

                            '.ant-input-prefix': {
                                display: 'none',
                            }
                        }
                    },
                }
            },
            '.__providers_list': {
                minWidth: 264,
                '.__providers_header': {
                    '.__providers_title': {
                        marginBottom: '24px',
                        'h4.ant-typography': {
                            fontSize: '24px',
                            margin: 0,
                        }
                    },

                }
            }
        },
    }
});

export default ChainDetail;
