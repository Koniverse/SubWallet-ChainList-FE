import {Icon, Tag} from '@subwallet/react-ui';
import CN from 'classnames';
import React, {useMemo} from 'react';
import styled from 'styled-components';
import {TFunction, useTranslation} from "react-i18next";
import {ThemeProps} from '../../types';
import {CrowdloanStatus, CrowdloanTagType} from "../../types/dataType";
import {convertHexColorToRGBA} from "../../libs";
import {TrafficCone, Confetti, Money} from 'phosphor-react';

interface Props extends ThemeProps {
    status?: CrowdloanStatus;
}

const createTagValue = (t: TFunction): Record<CrowdloanStatus, CrowdloanTagType> => {
    return {
        [CrowdloanStatus.IN_AUCTION]: {
            label: t('In auction'),
            color: '#D9A33E1A',
            icon: Money,
            weight: 'fill'
        },
        [CrowdloanStatus.FAILED]: {
            label: t('Fail'),
            color: 'rgba(191, 22, 22, 0.1)',
            icon: TrafficCone,
            weight: 'fill'
        },
        [CrowdloanStatus.WON]: {
            label: t('Won'),
            color: '#4CEAAC1A',
            icon: Confetti,
            weight: 'fill'
        },
        [CrowdloanStatus.WITHDRAW]: {
            label: t('Withdraw'),
            color: '#4CEAAC1A',
            icon: Money,
            weight: 'fill'
        },
    };
};


const Component: React.FC<Props> = (props: Props) => {
    const {status, className} = props;

    const {t} = useTranslation();

    const tag = useMemo((): CrowdloanTagType => {
            const earningTagTypes = createTagValue(t);

            return earningTagTypes[status || CrowdloanStatus.IN_AUCTION];
        }
        , [t, status]);
    const classNameStatus = useMemo(() => {
        return CN('__crowdloan_type', status && status.toString().toLowerCase());
    }, [status]);


    return (
        <Tag
            bgType={'default'}
            className={CN(className, classNameStatus)}
            color={tag.color}
            icon={(
                <Icon
                    phosphorIcon={tag.icon}
                    weight={tag.weight}
                />
            )}
        >
            {tag.label}
        </Tag>
    );
};


const CrowdloanTag = styled(Component)<Props>(({theme: {token}}: Props) => {
    return {
        '&.ant-tag-default': {
            backgroundColor: convertHexColorToRGBA(token['gray-6'], 0.1)
        },
        '&.__crowdloan_type.won': {
            color: '#4CEAAC',
            backgroundColor: convertHexColorToRGBA('#4CEAAC', 0.1),
        },
        '&.__crowdloan_type.in_auction': {
            color: token['gold-6'],
            backgroundColor: convertHexColorToRGBA(token['gray-6'], 0.1)
        },
        '&.__crowdloan_type.failed': {
            color: '#E11A1A',
            backgroundColor: convertHexColorToRGBA('#E11A1A', 0.1),
        }
    };
});

export default CrowdloanTag;
