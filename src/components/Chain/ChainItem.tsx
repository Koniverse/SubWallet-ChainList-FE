import {Button, Icon, Image, Typography} from '@subwallet/react-ui';
import CN from 'classnames';
import {PlusCircle} from 'phosphor-react';
import React, {useCallback, useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';
import {ThemeProps} from "../../types";
import {Chain, ChainType} from "../../types/dataType";
import ChainAssetGroup from "../ChainAssetGroup";
import {useNavigate} from "react-router-dom";
import ArrowRight from "../../components/Icon/ArrowRight";
import NetworkType from "../../components/Icon/NetworkType";
import {OpenSelectWallet} from "../../providers/WalletContextProvider";
import TestnetIcon from "../Icon/TestnetIcon";

type Props = ThemeProps & {
    compactMode?: boolean
    chain: Chain
};

function Component(props: Props): React.ReactElement<Props> {
    const {className, chain} = props;
    const {t} = useTranslation();
    const {open} = useContext(OpenSelectWallet);
    const navigate = useNavigate();
    const onClickConnect = useCallback((event: React.MouseEvent<HTMLElement>) => {
        open();
        event.stopPropagation();

    }, [open]);
    const type = useMemo(() => {
        if (chain.evmInfo && chain.substrateInfo) {
            return ChainType.ALL;
        }
        if (chain.substrateInfo) {
            return ChainType.SUBSTRATE
        }
        return ChainType.EVM
    }, [chain]);
    const onClickItem = useCallback((event: React.MouseEvent<HTMLElement>) => {
        navigate('/chain/' + chain.slug);
        event.stopPropagation();
    }, [chain, navigate])
    return (
        <div className={CN(className, '-normal-mode')} key={chain.id} onClick={onClickItem}>
            <div className={'__item-header'} onClick={onClickItem}>
                <Image
                    height={40}
                    src={chain.icon.data.attributes.url}
                    width={40}
                />
                <div className={'__item-title-group'}>
                    <div className='__item-title'>
                        {chain.name}
                    </div>
                    <div className='__item-subtitle'>
                        Chain ID:
                    </div>
                </div>
            </div>
            <div className={'__item-type'}>
                <div className="__item-type-icon">
                    <TestnetIcon isTestnet={chain.isTestnet}/>
                    <NetworkType type={type}/>
                </div>
                {
                    !!chain.chainAsset && !!chain.chainAsset.length && (
                        <div className='__item-chains-area'>
                            <ChainAssetGroup chainAsset={chain.chainAsset}/>
                        </div>
                    )
                }
            </div>

            <div className={'__item-connect'}>

                <div className="__item-connect-button">
                    <Button
                        className={'__item-connect'}
                        icon={(
                            <Icon
                                phosphorIcon={PlusCircle}
                                size={'sm'}
                                weight={'fill'}
                            />
                        )}

                        onClick={onClickConnect}
                        shape={'circle'}
                        type='ghost'
                        size={'xs'}
                    >
                        <Typography.Text>{t('Add to wallet')}</Typography.Text>
                    </Button>
                </div>

                <Button
                    className={'__sidebar-collapse-trigger'}
                    icon={<ArrowRight/>}
                    onClick={onClickItem}
                    size={'xs'}
                    type='ghost'
                />
            </div>
        </div>
    );
}

const ChainItem = styled(Component)<Props>(({theme: {token}}: Props) => {

    return {
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: 0,

        '&.-normal-mode': {
            padding: token.padding,
            backgroundColor: token.colorBgSecondary,
            borderRadius: token.borderRadiusLG
        },

        '.__item-header': {
            display: 'flex',
            overflow: 'hidden',
            gap: token.sizeXS,
            alignItems: 'center',
            marginBottom: token.marginSM,

            '.ant-image': {
                width: 38,
                height: 38,
                minWidth: 38
            }
        },
        '.__item-title, .__item-subtitle': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            'white-space': 'nowrap'
        },
        '.__item-title-group': {
            flex: 1,
            overflow: 'hidden'
        },
        '.__item-title': {
            fontSize: token.fontSizeLG,
            lineHeight: token.lineHeightLG,
            color: token.colorTextLight1
        },
        '.__item-subtitle': {
            fontSize: token.fontSizeSM,
            lineHeight: token.lineHeightSM,
            color: token.colorTextLight3
        },
        '.__item-description': {
            fontSize: token.fontSizeSM,
            lineHeight: token.lineHeightSM,
            color: token.colorTextLight3,
            height: token.lineHeightSM * 3 * token.fontSizeSM,
            display: '-webkit-box',
            '-webkit-line-clamp': '3',
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            marginBottom: token.marginSM
        },
        '.__item-tags-area': {
            display: 'flex',
            gap: token.sizeXS
        },
        '.__item-tag': {
            marginRight: 0
        },
        '.__item-type': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            '.__item-type-icon': {
                display: 'flex',
                gap: 4
            }
        },
        '.__item-connect': {
            display: 'flex',
            justifyContent: 'space-between',
            '.__item-connect-button': {
                display: 'flex',
                alignItems: 'center',
                gap: token.sizeXS,
                '.__item-connect': {
                    padding: 0
                }
            }
        },

        '&.-normal-mode:hover': {
            backgroundColor: token.colorBgInput
        },

        '&.-compact-mode': {
            display: 'flex',
            overflow: 'hidden',
            gap: token.sizeXS,
            alignItems: 'center',

            '.ant-image': {
                width: 44,
                height: 44,
                minWidth: 44
            },

            '.__item-title-wrapper': {
                display: 'flex',
                alignItems: 'center',
                gap: token.sizeXS
            },

            '.__item-tags-area': {
                gap: token.sizeXXS
            }
        }
    };
});

export default ChainItem;
