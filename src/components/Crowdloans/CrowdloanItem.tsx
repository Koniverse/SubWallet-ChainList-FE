// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {BalanceItemProps, Button, Icon, Typography} from '@subwallet/react-ui';
import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import {ThemeProps} from "../../types";
import {Hash} from "phosphor-react";
import {convertHexColorToRGBA} from "../../libs";
import {CrowdloanStatus} from "../../types/dataType";
import CN from "classnames";
import {useTranslation} from "react-i18next";

type Props = ThemeProps & {
    onPressItem?: BalanceItemProps['onPressItem'],
    status?: CrowdloanStatus,
    fundId: string,
};

function Component(
    props: Props) {
    const {t} = useTranslation();
    const {
        className = '',
        fundId,
        status
    } = props;

    return (
        <div className={classNames('crowdloan-item-container', className)}>
            <Button
                className={CN('__item-first', status?.toLowerCase())}
                icon={(
                    <Icon
                        phosphorIcon={Hash}
                        size={'sm'}
                        weight={'fill'}
                    />
                )}
                shape={'circle'}
                type='ghost'
                size={'xs'}
            />
            <div className='crowdloan-item-information'>
                <Typography.Text className='crowdloan-item-information__title'>
                    {t('Auction')} #{fundId}
                </Typography.Text>
            </div>
        </div>
    );
}

export const CrowdloanItem = styled(Component)<Props>(({theme: {token}}: Props) => {
    return ({
        '&.crowdloan-item-container': {
            display: 'flex',
            alignItems: 'center',
            '.__item-first': {

                borderRadius: '50%',

                '&.won': {
                    color: '#4CEAAC',
                    backgroundColor: convertHexColorToRGBA('#4CEAAC', 0.1),
                },
                '&.in_auction': {
                    color: token['gold-6'],
                    backgroundColor: convertHexColorToRGBA(token['gray-6'], 0.1),
                },
                '&.withdraw': {
                    color: 'rgb(195 142 43)',
                    backgroundColor: 'rgb(63 62 58)',
                },
                '&.failed': {
                    color: '#E11A1A',
                    backgroundColor: convertHexColorToRGBA('#E11A1A', 0.1),
                }
            },

            '.crowdloan-item-information': {
                marginLeft: 10,
                display: 'flex',
                flexDirection: 'column',

                '&__title': {
                    fontSize: token.fontSizeLG,
                    lineHeight: token.lineHeightLG
                },

                '&__sub-title': {
                    fontSize: 12,
                    lineHeight: token.lineHeightSM,
                    opacity: 0.65,
                    textAlign: 'start'
                }
            }
        }
    });
});
