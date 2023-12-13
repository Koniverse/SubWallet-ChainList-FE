import {Button, ButtonProps} from '@subwallet/react-ui';
import React from 'react';
import styled from "styled-components";
import {ThemeProps} from "../types";
import CN from "classnames";
import {convertHexColorToRGBA} from "../libs";

type Props = ButtonProps & ThemeProps;

const Component = (props: Props): React.ReactElement<Props> => {
    const {className} = props;

    return (
        <Button {...props} className={CN(className, '__button-background')}/>
    );
};
const ButtonBackground = styled(Component)<Props>(({theme: {token}}: Props) => {
    return {
        backgroundColor: convertHexColorToRGBA(token['gray-6'], 0.1),
        borderRadius: '50%',
        '&.ant-btn.-size-xs.-icon-only': {
            width: 24,
            height: 24,
        }
    };
})
export default ButtonBackground;
