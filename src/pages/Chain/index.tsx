import {Icon, ModalContext} from "@subwallet/react-ui";
import {useTranslation} from "react-i18next";
import {ThemeProps} from "../../types";
import styled from "styled-components";
import PageWrapper from "../../components/Layout/PageWrapper";
import React, {
    SyntheticEvent,
    useCallback,
    useContext,
    useEffect, useMemo, useState
} from "react";
import CN from 'classnames';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {AppContext} from "../../providers/AppStateProvider";
import ChainItem from "../../components/Chain/ChainItem";
import {useSelector} from "react-redux";
import {RootState} from "../../stores";
import {Chain as ChainType} from "../../types/dataType";
import Search from "../../components/Search";
import {FadersHorizontal} from 'phosphor-react';
import {useFilterModal} from "../../hooks/modal/useFilterModal";
import { FilterModal } from "../../components/Modal/FilterModal";

const FILTER_MODAL_ID = 'chain-index-filter-modal';

enum FilterValue {
    ALL = 'all',
    TESTNET = 'Testnet',
    MAINNET = 'Mainnet'
}

const Component = () => {
    const {t} = useTranslation();
    const {chainList} = useSelector((state: RootState) => state.chainStore);
    const [searchInput, setSearchInput] = useState<string>('');
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const {setTitle, setShowBackButtonOnHeader} = useContext(AppContext);
    const handleSearch = useCallback((value: string) => setSearchInput(value), [setSearchInput]);
    const {
        filterSelectionMap,
        onChangeFilterOption,
        selectedFilters,
        onApplyFilter,
        onCloseFilterModal
    } = useFilterModal(FILTER_MODAL_ID);
    const {activeModal} = useContext(ModalContext);

    const filterOptions = useMemo(() => [
        {label: t('All'), value: FilterValue.ALL},
        {label: t('Mainnet'), value: FilterValue.MAINNET},
        {label: t('Testnet'), value: FilterValue.TESTNET},
    ], [t]);

    const onClickActionBtn = useCallback(
        (e?: SyntheticEvent) => {
            e && e.stopPropagation();
            activeModal(FILTER_MODAL_ID);
        },
        [activeModal]);

    useEffect(() => {
        setTitle(t('Chain List'));
        setShowBackButtonOnHeader(false);
    }, [setShowBackButtonOnHeader, setTitle, t]);

    const TAB_LIST = useMemo(() => {
        return [t('All'), t('Substrade'), t('EVM')];
    }, [t]);

    const handleSelectTab = useCallback((index: number) => {
        setActiveTabIndex(index);
    }, []);

    const filteredList = useMemo(() => {
        let searchTestnet: boolean | null = null;
        if (selectedFilters.length > 0) {
            if (!selectedFilters.includes(FilterValue.ALL)) {
                searchTestnet = selectedFilters.includes(FilterValue.TESTNET);
            }
            if (selectedFilters.includes(FilterValue.TESTNET) && selectedFilters.includes(FilterValue.MAINNET)) {
                searchTestnet = null;
            }
        }

        return chainList.filter((node: ChainType) => {
            let filter = true;
            if (searchInput) {
                filter = node.name.toLowerCase().includes(searchInput.toLowerCase())
            }
            if (activeTabIndex === 1) {
                filter = filter && node.substrateInfo !== null;
            }
            if (activeTabIndex === 2) {
                filter = filter && node.evmInfo !== null;
            }
            if (searchTestnet !== null) {
                filter = filter && node.isTestnet === searchTestnet;
            }
            return filter;

        });
    }, [chainList, searchInput, activeTabIndex, selectedFilters]);


    return (
        <>
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

                    {/* fake tabpane to remove error logs */}
                    <div style={{display: 'none'}}>
                        <TabPanel></TabPanel>
                        <TabPanel></TabPanel>
                        <TabPanel></TabPanel>
                    </div>
                </Tabs>

                <div className='right-section'>
                    <Search
                        actionBtnIcon={(
                            <Icon
                                phosphorIcon={FadersHorizontal}
                                size='sm'
                            />
                        )}
                        onClickActionBtn={onClickActionBtn}
                        onSearch={handleSearch}
                        placeholder={t('Chain, ID , Type,...')}
                        searchValue={searchInput}
                        showActionBtn
                    />
                </div>
            </div>
            <div className={'__chain-list-container'}>
                {
                    filteredList.map((i, index) => (
                        <ChainItem
                            className={'__chain-item'}
                            compactMode={false}
                            chain={i}
                            key={index}
                            {...i}
                        />
                    ))
                }
            </div>
            <FilterModal
                applyFilterButtonTitle={t('Apply filter')}
                id={FILTER_MODAL_ID}
                onApplyFilter={onApplyFilter}
                onCancel={onCloseFilterModal}
                onChangeOption={onChangeFilterOption}
                optionSelectionMap={filterSelectionMap}
                options={filterOptions}
                title={t('Filter')}
            />
        </>
    )
}
type Props = ThemeProps;
type WrapperProps = ThemeProps & {
    searchInput?: string
}

function WrapperComponent({className = ''}: ThemeProps): React.ReactElement<Props> {

    return (
        <PageWrapper
            className={`tokens ${className}`}
        >
            <Component/>
        </PageWrapper>
    );
}

const Chain = styled(WrapperComponent)<WrapperProps>(({theme: {extendToken, token}}: WrapperProps) => {
    return ({
        overflow: 'hidden',
        '.__empty-list': {
            marginTop: token.marginSM,
            marginBottom: token.marginSM
        },


        '.__chain-list-area': {
            flex: 1,
            marginTop: 32,
            marginBottom: 40,
        },

        '.__chain-list-container': {
            marginTop: 32,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            alignItems: 'stretch',
            gap: token.size
        },

        '.__chain-item.-is-stared': {
            order: -1
        },


        '.react-tabs__tab-list': {
            display: 'flex',
            borderRadius: token.borderRadiusLG,
            margin: 0,
            padding: 0
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
        }

    });
});

export default Chain;
