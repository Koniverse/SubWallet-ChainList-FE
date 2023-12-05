import {Tag} from '@subwallet/react-ui';
import CN from 'classnames';
import React, {useMemo} from 'react';
import styled from 'styled-components';
import {TFunction, useTranslation} from "react-i18next";
import {ThemeProps} from '../types';
import { ConnectionStatus, ProviderConnectionType} from "../types/dataType";
import {convertHexColorToRGBA} from "../libs";

interface Props extends ThemeProps {
  status?: ConnectionStatus;
}

const createTagValue = (t: TFunction): Record<ConnectionStatus, ProviderConnectionType> => {
  return {
    [ConnectionStatus.CHECKING]: {
      label: t('Checking'),
      color: '#D9A33E1A',
    },
    [ConnectionStatus.FAIL]: {
      label: t('Fail'),
      color: 'rgba(191, 22, 22, 0.1)',
    },
    [ConnectionStatus.CONNECTED]: {
      label: t('Success'),
      color: '#4CEAAC1A', //#4CEAAC
    },
  };
};


const Component: React.FC<Props> = (props: Props) => {
  const { status, className } = props;

  const { t } = useTranslation();

  const tag = useMemo((): ProviderConnectionType =>
      {
        const earningTagTypes = createTagValue(t);

        return earningTagTypes[status || ConnectionStatus.CONNECTED];
      }
  , [ t, status]);
  const classNameStatus = useMemo(() => {
    return CN('provider-connection-status', status && status.toString().toLowerCase());
  }, [status]);
  

  return (
    <Tag
      bgType={'default'}
      className={CN(className, classNameStatus)}
      color={tag.color}
    >
      {tag.label}
    </Tag>
  );
};



const ProviderConnectionStatus = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return {
    '&.ant-tag-default': {
      backgroundColor: convertHexColorToRGBA(token['gray-6'], 0.1)
    },
    '&.provider-connection-status.connected': {
      color: '#4CEAAC',
    },
    '&.provider-connection-status.checking': {
      color: token['gold-6'],
    },
    '&.provider-connection-status.fail': {
      color: '#E11A1A',
    }
  };
});

export default ProviderConnectionStatus;
