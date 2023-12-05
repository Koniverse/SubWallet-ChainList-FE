import {Image} from '@subwallet/react-ui';
import CN from 'classnames';
import React from 'react';
import styled from 'styled-components';
import {ThemeProps} from "../types";
import {ChainAsset} from "../types/dataType";

export interface NetworkGroupProps extends ThemeProps {
  chainAsset: ChainAsset[]
}

const Component: React.FC<NetworkGroupProps> = (props: NetworkGroupProps) => {
  const { chainAsset, className } = props;

  const countMore: number = chainAsset.length - 3;

  return (
    <div className={CN('chain-logos', className)}>
      <div className='content-container'>
        {
          chainAsset.slice(0, 3).map((item, index) => {
            return (
              <div
                className={CN(
                  'avatar-content',
                  {
                    'avatar-blur': index === 2 && countMore > 0
                  }
                )}
                key={index}
              >
                <Image
                    src={item.icon.data.attributes.url}
                    height={24}
                    width={24}
                />
              </div>
            );
          })
        }
        {
          countMore > 0 && (
            <div className='cont-more'>+{countMore}</div>
          )
        }
      </div>
    </div>
  );
};

const ChainAssetGroup = styled(Component)<NetworkGroupProps>(({ theme: { token } }: NetworkGroupProps) => {
  return {
    width: 'fit-content',

    '.ant-image, .ant-image-img': {
      display: 'block'
    },

    '.ant-sw-avatar': {
      background: token.colorBgSecondary,

      '.icon': {
        overflow: 'hidden'
      }
    },

    '.content-container': {
      display: 'flex',
      height: token.sizeMD,
      alignItems: 'center',
      flexDirection: 'row',
      position: 'relative',

      '.avatar-content': {
        marginLeft: -8,
        '.ant-image-img': {
          boxSizing: 'content-box'
        }
      },

      '&.ml-strong': {
        '.avatar-content': {
          marginLeft: -10
        }
      }
    },

    '.avatar-content:first-child': {
      marginLeft: '0 !important'
    },

    '.avatar-content:first-child, .avatar-blur': {
      position: 'relative',

      '&:after': {
        content: '""',
        position: 'absolute',
        display: 'block',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: token.borderRadiusLG
      }
    },

    '.avatar-content:last-child': {
      opacity: 1
    },

    '.cont-more': {
      fontSize: token.sizeXS,
      lineHeight: `${token.size}px`,
      position: 'absolute',
      width: token.sizeMD,
      height: token.sizeMD,
      right: 0,
      top: 0,
      fontWeight: 700,
      color: token.colorTextBase,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };
});

export default ChainAssetGroup;
