// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {BalanceItemProps, Image, Typography} from '@subwallet/react-ui';
import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import {ThemeProps} from "../../types";

type Props = ThemeProps & {
    onPressItem?: BalanceItemProps['onPressItem'],
    url?: string,
    symbol: string,
    slug?: string,
    id?: string,
};

function Component(
    props: Props) {
    const {
        className = '',
        url,
        id,
        symbol
    } = props;
    // todo: Update BalanceItem in react-ui lib
    // - loading
    // - auto detect logo, only use logoKey
    // - price change status

    return (
        <div className={classNames('token-item-container', className)}>
            <Image
                height={40}
                src={url}
                width={40}
            />
            <div className='token-item-information'>
                <Typography.Text className='token-item-information__title'>
                    {symbol}
                </Typography.Text>
                {id && (
                    <Typography.Text className='token-item-information__sub-title'>
                        {id}
                    </Typography.Text>
                )}
            </div>
        </div>
    );
}

export const TokenItem = styled(Component)<Props>(({theme: {token}}: Props) => {
    return ({
        '&.token-item-container': {
            display: 'flex',

            '.token-item-information': {
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
