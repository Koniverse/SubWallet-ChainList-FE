
import {theme as SwReactUI} from '@subwallet/react-ui';
import {Web3LogoMap} from '@subwallet/react-ui/es/config-provider/context';
import logoMap from '@subwallet/react-ui/es/theme/themes/logoMap';
import derivative from "@subwallet/react-ui/es/theme/themes/default";

// todo: will standardized logoMap later
const defaultLogoMap: Web3LogoMap = {
    ...logoMap
};

const currentToken = {
    ...SwReactUI.defaultSeed,
    colorBgBase: '#ffffff',
    colorTextBase: '#444444',
    gray: '#dddddd',
    colorLink: '#562b8e',
    colorPrimary: '#562b8e',
    bodyFontWeight: '400',
    fontFamily: '\'Montserrat\', sans-serif',
}

export const appTheme = {
    id: 'light',
    name: 'Light',
    algorithm: SwReactUI.defaultAlgorithm,
    token: derivative(currentToken),
    extendToken: {
        colorTitle: currentToken.colorPrimary,
        collectionImageSize: 480,
        nftImageSize: 480,
        mobileSize: '992px',
        mediumSize: '1200px',
        largeSize: '1600px',
    },
    logoMap: defaultLogoMap,
}
