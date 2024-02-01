import { BalanceItemProps, Number } from '@subwallet/react-ui';
import classNames from 'classnames';
import React, { Context, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import {ThemeProps} from "../../types";
import {Theme} from "../../themes";

type Props = ThemeProps & {
  onPressItem?: BalanceItemProps['onPressItem'],
  value: number,
  pastValue: number,
};

function Component (
  { className = '',
    pastValue,
    value }: Props) {

  const token = useContext<Theme>(ThemeContext as Context<Theme>).token;
  const priceChangeStatus = (() => {
    if (value > pastValue) {
      return 'increase';
    } else if (value < pastValue) {
      return 'decrease';
    }

    return null;
  })();

  const marginColor = priceChangeStatus === 'decrease' ? token.colorError : token.colorSuccess;
  const margin = !pastValue || !value ? 0 : Math.abs(pastValue - value) / pastValue * 100;

  return (
    <div className={classNames('token-price', className, {
      '-price-decrease': priceChangeStatus === 'decrease'
    })}
    >
      <Number
        className={'__value'}
        decimal={0}
        decimalOpacity={0.45}
        prefix={'$'}
        value={value ?? 0}
      />
      <Number
        className={'__percentage'}
        decimal={0}
        decimalColor={marginColor}
        intColor={marginColor}
        prefix={priceChangeStatus === 'decrease' ? '-' : '+'}
        suffix='%'
        unitColor={marginColor}
        value={margin ?? 0}
      />
    </div>
  );
}

export const TokenPrice = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return ({
    '.ant-number .ant-typography': {
      fontSize: 'inherit !important',
      lineHeight: 'inherit',
      textAlign: 'end'
    },

    '.__value': {
      lineHeight: token.lineHeightLG,
      fontSize: token.fontSizeLG
    },

    '.__percentage': {
      lineHeight: token.lineHeightSM,
      fontSize: token.fontSizeSM
    }
  });
});
