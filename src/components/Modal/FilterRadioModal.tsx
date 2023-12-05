import {Button, Icon, Radio} from '@subwallet/react-ui';
import {CheckboxChangeEvent} from '@subwallet/react-ui/es/checkbox';
import {FadersHorizontal} from 'phosphor-react';
import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';
import {BaseModal} from './BaseModal';
import {ThemeProps} from "../../types";

export type OptionType = {
    label: string,
    value: string,
};

interface Props extends ThemeProps {
    id: string;
    onCancel: () => void;
    title?: string;
    applyFilterButtonTitle?: string;
    onApplyFilter?: (value: any) => void;
    optionSelectionMap: Record<string, boolean>;
    options: OptionType[];
    onChangeOption: (value: string, isChecked: boolean) => void;
    closeIcon?: React.ReactNode;
}

function Component(props: Props): React.ReactElement<Props> {
    const {t} = useTranslation();
    const [value, setValue] = useState('');
    const {
        applyFilterButtonTitle,
        className = '',
        closeIcon,
        id,
        onApplyFilter,
        onCancel,
        options,
        title
    } = props;
    const _onChange = useCallback((e: CheckboxChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    }, []);
    const filterModalFooter = useMemo(() => {
        return (
            <Button
                block={true}
                className={'__apply-button'}
                icon={
                    <Icon
                        phosphorIcon={FadersHorizontal}
                        weight={'bold'}
                    />
                }
                onClick={() => {
                    onApplyFilter && onApplyFilter(value);
                }}
            >
                {applyFilterButtonTitle || t('Apply filter')}
            </Button>
        );
    }, [applyFilterButtonTitle, t, onApplyFilter, value]);

    return (
        <BaseModal
            className={className}
            closeIcon={closeIcon}
            footer={filterModalFooter}
            id={id}
            onCancel={onCancel}
            title={title || t('Filter')}
        >
            <div className={'__options-container'}>
                <Radio.Group onChange={_onChange}>
                    {
                        options.map((option) => (
                            <div
                                className={'__option-item'}
                                key={option.value}
                            >
                                <Radio
                                    value={option.value}
                                >
                                    <span className={'__option-label'}>{option.label}</span>
                                </Radio>
                            </div>
                        ))
                    }
                </Radio.Group>
            </div>
        </BaseModal>
    );
}

export const FilterRadioModal = styled(Component)<Props>(({theme: {token}}: Props) => {
    return ({
        '.ant-sw-modal-body': {
            paddingBottom: token.paddingXS
        },

        '.ant-sw-modal-footer': {
            borderTop: 0
        },

        '.__option-item': {
            display: 'flex'
        },

        '.__option-item + .__option-item': {
            marginTop: token.sizeLG
        },

        '.ant-checkbox-wrapper': {
            display: 'flex',
            alignItems: 'center'
        }
    });
});
