import React, {
    useCallback,
    useContext,
    useEffect, useMemo,
    useState
} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AppContext} from "../../providers/AppStateProvider";
import {useTranslation} from "react-i18next";
import {ThemeProps} from "../../types";
import {Button, Col, Icon, Image, Popover, Row, Typography} from "@subwallet/react-ui";
import PageWrapper from "../../components/Layout/PageWrapper";
import styled from "styled-components";
import Logo2D from "../../components/Logo/Logo2D";
import TokenTable from './TokenTable';
import {Chain, ChainType} from "../../types/dataType";
import NetworkType from "../../components/Icon/NetworkType";
import {useSelector} from "react-redux";
import {RootState} from "../../stores";
import ProviderList from "../../components/Chain/ProviderList";
import {MagnifyingGlass, X} from "phosphor-react";
import Search from "../../components/Search";
import ClowdloanTable from "./ClowdloanTable";
import {ScreenContext, Screens} from "../../providers/ScreenContext";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import CN from "classnames";
import ProviderTable from "../../components/Chain/ProviderTable";
import { OpenSelectWallet } from '../../providers/WalletContextProvider';
import {openInNewTab} from "../../libs";

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
    const {open} = useContext(OpenSelectWallet);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [searchInput, setSearchInput] = useState<string>('');
    const [searchInputAll, setSearchInputAll] = useState<string>('');
    const [searchInputProvider, setSearchInputProvider] = useState<string>('');
    const handleSearch = useCallback((value: string) => setSearchInput(value), [setSearchInput]);
    const handleSearchProvider = useCallback((value: string) => setSearchInputProvider(value), [setSearchInputProvider]);
    const handleSearchAll = useCallback((value: string) => setSearchInputAll(value), [setSearchInputAll]);
    const navigate = useNavigate();
    const [chain, setChain] = useState<ChainDetailType>({} as ChainDetailType);
    const [showSearchProvider, setShowSearchProvider] = useState(false);
    const {screenType} = useContext(ScreenContext);
    const handleConnectWallet = useCallback(() => {
        open();
    }, []);
    const handleHoverIconProviderSearch = useCallback(
        (visible: boolean) => {
            setShowSearchProvider(visible)
        }, [setShowSearchProvider]);
    const goBack = useCallback(() => {
        navigate('/');
    }, [navigate]);
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

    const TAB_LIST = useMemo(() => {
        return [t('Tokens list'), t('Providers list'), t('Crowdloan funds')];
    }, [t]);

    const handleSelectTab = useCallback((index: number) => {
        setActiveTabIndex(index);
    }, []);
    useEffect(() => {
        if (activeTabIndex === 0) {
            setSearchInput(searchInputAll);
        } else if (activeTabIndex === 1) {
            setSearchInputProvider(searchInputAll);
        }
    }, [searchInputAll])

    const isTablet = useMemo(() => {
        return screenType !== Screens.DESKTOP;
    }, [screenType]);
    const chainInfoContent = useMemo(() => {
        return (
            <div className={CN('__chain-info', isTablet ? '__tablet' : '')}>
                <div className={CN('__item-data')}>
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
                        <Row className='__item-data'>
                            <Col span={8} className='__item-group'>
                                <span className="__item-label">Chain ID:</span>
                                <span className="__item-value">
                                    {chain.id}
                                </span>
                            </Col>
                            <Col span={8} className='__item-group'>
                                <span className="__item-label">Address prefix:</span> {chain.addressPrefix}
                            </Col>
                            <Col span={8} className='__item-group'>
                                <span className="__item-label">ParaID:</span>
                                <span className="__item-value">
                                    {chain.paraId}
                                </span>
                            </Col>
                            <Col span={8} className='__item-group'>
                                <span className="__item-label">Type:</span>
                                <span className="__item-type">
                                    <NetworkType type={chain.type}/>
                                </span>
                            </Col>
                            <Col span={8} className='__item-group'>
                                <span className="__item-label">Decimals:</span>
                                <span className="__item-value">
                                    {chain.decimals}
                                </span>
                            </Col>
                            <Col span={8} className='__item-group'>
                                <span className="__item-label">Symbol:</span>
                                <span className="__item-value">
                                    {chain.symbol}
                                </span>
                            </Col>
                            <Col span={12} className='__item-group'>
                                <span className="__item-label __full-width">Block explorer:</span>
                                <span className="__item-value" onClick={() => {
                                    console.log('chain.blockExplorer', chain.blockExplorer)
                                    if (chain.blockExplorer) {
                                        openInNewTab(chain.blockExplorer)();
                                    }
                                }}>
                                    {chain.blockExplorer}
                                </span>
                            </Col>
                            <Col span={12} className='__item-group'>
                                <span className="__item-label __full-width">Crowdloan URL:</span>

                                <span className="__item-value" onClick={() => {
                                    if (chain.crowdloanUrl) {
                                        openInNewTab(chain.crowdloanUrl)();
                                    }
                                }}>
                                    {chain.crowdloanUrl}
                                </span>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className={'__item-button'}>
                    <Button
                        icon={<Logo2D/>}
                        className={'__button_connect'}
                        onClick={handleConnectWallet}
                    >
                        {t('Add to wallet')}
                    </Button>
                </div>
            </div>
        )
    }, [chain, t]);
    if (isTablet) {
        return (
            <div className={'__chain-detail'}>
                {chainInfoContent}
                {isTablet && (
                    <div className='menu-bar'>
                        <Tabs
                            onSelect={handleSelectTab}
                            selectedIndex={activeTabIndex}
                        >
                            <TabList
                                className={CN('react-tabs__tab-list')}
                            >
                                {TAB_LIST.map((label) => (
                                    <Tab key={label}>{label}</Tab>
                                ))}
                            </TabList>
                            <div style={{display: 'none'}}>
                                <TabPanel></TabPanel>
                                <TabPanel></TabPanel>
                                <TabPanel></TabPanel>
                            </div>
                        </Tabs>

                        <div className='right-section'>
                            <Search
                                onSearch={handleSearchAll}
                                placeholder={t('Token, providers...')}
                                searchValue={searchInputAll}
                                showActionBtn
                            />
                        </div>
                    </div>
                )}
                <div className={'__chain-list-container'}>
                    {
                        activeTabIndex === 0 && <TokenTable chainAssetList={chain.chainAsset}
                                                            searchInput={searchInput}
                                                            chainSlug={slug}
                        />
                    }
                    {
                        activeTabIndex === 1 && chain.providers && <ProviderTable chain={chain}
                                                                                  searchInput={searchInputProvider}/>
                    }
                    {
                        activeTabIndex === 2 && <ClowdloanTable crowdLoanList={chain.crowdLoanList}/>
                    }
                </div>
            </div>
        );
    }


    return (
        <div className={'__chain-detail'}>
            {chainInfoContent}
            <div className="__data-list">
                <div className="__left-section">
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
                                            iconColor={'#fff'}
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
                                        searchInput={searchInputProvider}
                                        chainSlug={slug}
                                        pagination={{defaultPageSize: 10, showSizeChanger: false}}
                            />
                        </div>
                    </div>

                    <div className='__crowdloan_list'>
                        <div className="__item_header">
                            <div className="__item_title">
                                <Typography.Title level={4}>{t('Crowdloan funds')}</Typography.Title>
                            </div>
                        </div>
                        <div className="__items token-table">
                            <ClowdloanTable crowdLoanList={chain.crowdLoanList}/>
                        </div>
                    </div>
                </div>
                <div className="__providers_list">
                    <div className="__providers_header">
                        <div className="__providers_title">
                            <Typography.Title level={4}>{t('Providers')}</Typography.Title>
                        </div>

                        <div className="__providers_search">
                            {showSearchProvider &&
                                <Search
                                    actionBtnIcon={(
                                        <Icon
                                            phosphorIcon={X}
                                            size='sm'
                                            iconColor={'#fff'}
                                        />
                                    )}
                                    onClickActionBtn={() => {
                                        setShowSearchProvider(false);
                                    }}
                                    onSearch={handleSearchProvider}
                                    placeholder={t('Provider name ...')}
                                    searchValue={searchInputProvider}
                                    showActionBtn
                                />
                            }
                            {!showSearchProvider &&
                                <Popover onOpenChange={handleHoverIconProviderSearch}
                                >
                                    <Button
                                        icon={(
                                            <Icon
                                                phosphorIcon={MagnifyingGlass}
                                                size={'sm'}
                                                iconColor={'#fff'}
                                            />
                                        )}
                                        shape={'circle'}
                                        type='ghost'
                                        size={'xs'}
                                    />
                                </Popover>
                            }
                        </div>
                    </div>

                    <div className="__providers_content">
                        {chain.providers && <ProviderList chain={chain} searchInput={searchInputProvider}/>}
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
            backgroundColor: token.colorBgSecondary,
            marginBottom: '24px',
            borderRadius: token.borderRadiusLG,
            '& > div': {
                color: '#fff',
            },
            '.__item-data': {
                display: 'flex',
                '.__item-group': {
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '8px',
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 600,
                    color: '#FFFFFFD9',
                    '.__item-value': {
                        fontWeight: 500,
                        color: '#FFFFFFA6',
                        marginLeft: '12px',
                        wordBreak: 'break-word',
                        cursor: 'pointer',
                    },
                    '.__item-type': {
                        marginLeft: '12px',
                        display: 'flex',
                    }

                },
                '.__item-title': {
                    marginBottom: '8px',
                    'h4.ant-typography': {
                        fontSize: '24px',
                        margin: 0,
                    }
                },
            },

            '.__button_connect': {
                width: '240px',
                height: '52px',
                padding: '16px',
                borderRadius: '32px',
                gap: '8px'
            },

            '&.__tablet': {
                justifyContent: 'start',
                flexDirection: 'column',
                '.__item-group': {
                    minWidth: '100%'
                },
                '.__item-button': {
                    margin: '0 auto',
                    marginTop: 12
                }
            },
            '.__item-icon': {
                marginRight: '24px',
            },
        },

        '.menu-bar': {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'transparent',
            minHeight: 50,

            '.web-header': {
                flex: 1,
                '.header-content': {
                    color: token.colorTextBase,
                    fontWeight: token.fontWeightStrong,
                    fontSize: token.fontSizeHeading4,
                    lineHeight: token.lineHeightHeading4,
                    display: 'flex',
                    flexDirection: 'row',
                    overflow: 'hidden'
                }
            },
            '.react-tabs__tab-list': {
                paddingInlineStart: 0,
            },

            '.react-tabs__tab': {
                textAlign: 'center',
                display: 'inline-block',
                border: 'none',
                outline: 'none',
                position: 'relative',
                listStyle: 'none',
                fontSize: token.fontSizeLG,
                lineHeight: token.lineHeightLG,
                fontWeight: token.headingFontWeight,
                cursor: 'pointer',
                flex: 'unset',
                borderRadius: 0,
                color: token.colorTextLight4,
                padding: 0,
                marginRight: 16,
                paddingTop: 10,
                paddingBottom: token.paddingXS,
                borderBottom: '2px solid transparent',


                '&--selected': {
                    background: 'transparent',
                    color: token.colorTextLight2,
                    borderBottomColor: token.colorTextLight2
                }
            },

            '.right-section': {
                justifySelf: 'end',
                display: 'flex',
                '.search-input': {
                    width: 360,
                    height: 50,
                    '&.ant-input-container .ant-input': {
                        borderRadius: 8,
                    }
                }
            }
        },
        '.__data-list': {
            display: 'flex',
            '.__left-section': {
                flex: 2,
                marginRight: '64px',
                '.__token_list': {
                    display: 'flex',
                    flexDirection: 'column',

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
                }
            },
            '.__providers_list': {
                minWidth: 264,
                '.__providers_header': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    '.__providers_title': {
                        marginBottom: '24px',
                        'h4.ant-typography': {
                            fontSize: '24px',
                            margin: 0,
                        }
                    },
                    '.__providers_search': {
                        marginLeft: 12,
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
                    },

                }
            }
        },
    }
});

export default ChainDetail;
