import {Button, Image, Number, Tag} from '@subwallet/react-ui';
import React, {useMemo} from 'react';
import styled from 'styled-components';
import {ThemeProps} from '../../types';
import {useTranslation} from "react-i18next";
import {BaseModal} from '../../components/Modal/BaseModal';
import {ChainAsset} from "../../types/dataType";
import Logo2D from "../../components/Logo/Logo2D";
import {capitalizeFirstLetter} from "../../utils";

type Props = ThemeProps & {
    id: string,
    onCancel: () => void,
    tokenDetail: ChainAsset | undefined,
    currentPrice: number,
    pastPrice: number,
}

type ItemType = {
    label: string,
    key: string,
    value: string
}

function Component({
                       className = '',
                       tokenDetail,
                       id,
                       currentPrice,
                       pastPrice,
                       onCancel
                   }: Props): React.ReactElement<Props> {
    const {t} = useTranslation();
    const margin = useMemo(() => !pastPrice || !currentPrice ? 0 : Math.abs(pastPrice - currentPrice) / pastPrice * 100, [pastPrice, currentPrice]);
    const isTotalBalanceDecrease = useMemo(() => currentPrice < pastPrice, [currentPrice, pastPrice]);

    const items: ItemType[] = useMemo(() => {
        let contractAddress = '', xcmbuyWith = '', xcmChanel = '';
        if (tokenDetail){
            if (tokenDetail.metadata && tokenDetail.metadata.contractAddress){
                contractAddress = tokenDetail.metadata.contractAddress;
            }
            if (tokenDetail.assetRefs.length > 0){
                const items: string[] = [];
                console.log(tokenDetail.assetRefs)
                tokenDetail.assetRefs.forEach((item) => {
                    items.push(capitalizeFirstLetter(item.destAsset.data.attributes.name));
                })
                xcmChanel += `${items.join(', ')}`;
            }
            if (tokenDetail.buyTokenConfigs.length > 0){
                const items: string[] = [];
                tokenDetail.buyTokenConfigs.forEach((item) => {
                    item.services.forEach((service) => {
                        items.push(capitalizeFirstLetter(service.service))
                    })
                })
                xcmbuyWith += `${items.join(', ')}`;
            }
        }
        return [
            {
                key: 'symbol',
                label: t('Symbol'),
                value: tokenDetail?.symbol || ''
            },
            {
                key: 'tokenName',
                label: t('Token name'),
                value: tokenDetail?.name || ''
            },
            {
                key: 'tokenType',
                label: t('Token type'),
                value: tokenDetail?.assetType || ''
            },
            {
                key: 'contractAddress',
                label: t('Contract'),
                value: contractAddress
            },
            {
                key: 'buyWith',
                label: t('Buy with'),
                value: xcmbuyWith
            },
            {
                key: 'xcm',
                label: t('XCM Chanel'),
                value: xcmChanel
            }
        ];
    }, [tokenDetail, t])


    return (
        <BaseModal
            className={className}
            id={id}
            onCancel={onCancel}
            title={t('Token details')}
        >
            <div className={'__container'}>
                <div className="__center">
                    <Image
                        height={96}
                        src={tokenDetail?.icon.data.attributes.url}
                        width={96}
                    />
                    <Number
                        prefix={'$'}
                        decimal={0}
                        decimalOpacity={0.45}
                        intOpacity={0.85}
                        size={38}
                        unitOpacity={0.85}
                        value={currentPrice}
                    />

                    <Tag
                        className={`__balance-change-percent ${isTotalBalanceDecrease ? '-decrease' : ''}`}
                        shape={'round'}
                    >
                        <Number
                            decimal={0}
                            decimalOpacity={1}
                            prefix={isTotalBalanceDecrease ? '-' : '+'}
                            suffix={'%'}
                            size={16}
                            value={margin}
                            weight={700}
                            unitColor={'#000'}
                            intColor={'#000'}
                            decimalColor={'#000'}
                        />
                    </Tag>
                </div>
                {items.map((item) => (
                    <div
                        className={'__row'}
                        key={item.key}
                    >
                        <div className={'__label'}>{item.label}</div>
                        <div className={'__value'}>{item.value.toString()}</div>
                    </div>
                ))}

                <Button
                    block={true}
                    icon={<Logo2D height={18} width={12.12}/>}
                    className={'__button_connect'}
                >
                    {t('Add to wallet')}
                </Button>
            </div>
        </BaseModal>
    );
}

export const TokenDetailModal = styled(Component)<Props>(({theme: {token}}: Props) => {
    return ({
        '.__container': {
            padding: '12px 12px 4px',
            '.__center': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: token.marginSM
            }
        },

        '.__row': {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: token.marginSM
        },

        '.__label': {
            paddingRight: token.paddingSM
        },
        '.__value': {
            width: 162,
            textAlign: 'right'
        },
        '.__button_connect svg': {
            marginRight: token.marginSM
        },


        '.__balance-change-percent': {
            backgroundColor: token['cyan-6'],
            color: '#0000000',
            marginInlineEnd: 0,
            display: 'flex',

            '&.-decrease': {
                backgroundColor: token.colorError,
                color: '#0000000',
            },

            '.ant-number': {
                fontSize: token.fontSizeXS
            }
        },
    });
});
