import {
    AliasToken as _AliasToken,
    GlobalToken as _GlobalToken
} from "@subwallet/react-ui/es/theme/interface";
import {ThemeConfig as _ThemeConfig, Web3LogoMap} from "@subwallet/react-ui/es/config-provider/context";
import logoMap from "@subwallet/react-ui/es/theme/themes/logoMap";
import {IconMap} from "@subwallet/react-ui/es/result";
import subWalletLogo from './assets/sub-wallet-logo.svg';
import defaultImagePlaceholder from './assets/default-image-placeholder.png';
import {theme as SwReactUI} from '@subwallet/react-ui';

export enum ThemeNames {
    LIGHT = 'light',
    DARK = 'dark',
    SUBSPACE = 'subspace'
}

export type ThemeConfig = _ThemeConfig;
export type AliasToken = _AliasToken;
export type GlobalToken = _GlobalToken;

const SwLogosMap: Record<string, string> = {};


export interface ExtraToken {
    oneColumnWidth: number,
    bigOneColumnWidth: number,
    twoColumnWidth: number,
    bodyBackgroundColor: string,
    logo: string,
    defaultImagePlaceholder: string
    tokensScreenSuccessBackgroundColor: string,
    tokensScreenDangerBackgroundColor: string,
    tokensScreenInfoBackgroundColor: string,
}


export type Theme = {
    id: ThemeNames;
    name: string;
    token: GlobalToken;

    // todo: add extend token later
    extendToken: ExtraToken,
    logoMap: Web3LogoMap,
};

export interface SwThemeConfig extends ThemeConfig {
    id: ThemeNames,
    name: string;

    generateExtraTokens: (token: AliasToken) => ExtraToken;

    customTokens: (token: AliasToken) => AliasToken;
    logoMap: Web3LogoMap
}


// todo: will standardized logoMap later
const defaultLogoMap: Web3LogoMap = {
    ...logoMap,
    network: {
        ...IconMap,
        ...SwLogosMap
    },
    symbol: {
        ...IconMap,
        ...SwLogosMap
    },
    default: SwLogosMap.default
};

function genDefaultExtraTokens(token: AliasToken): ExtraToken {
    return {
        oneColumnWidth: 400,
        bigOneColumnWidth: 600,
        twoColumnWidth: 820,
        bodyBackgroundColor: '#0C0C0C',
        logo: subWalletLogo,
        defaultImagePlaceholder,
        tokensScreenSuccessBackgroundColor: 'linear-gradient(180deg, rgba(76, 234, 172, 0.10) 5%, rgba(217, 217, 217, 0.00) 33%)',
        tokensScreenDangerBackgroundColor: 'linear-gradient(180deg, rgba(234, 76, 76, 0.10) 5%, rgba(217, 217, 217, 0.00) 33%)',
        tokensScreenInfoBackgroundColor: 'linear-gradient(180deg, rgba(0, 75, 255, 0.1) 16.47%, rgba(0, 75, 255, 0) 94.17%);'
    };
}

// Todo: i18n for theme name
// Implement theme from @subwallet/react-ui
export const SW_THEME_CONFIGS: Record<ThemeNames, SwThemeConfig> = {
    [ThemeNames.DARK]: {
        id: ThemeNames.DARK,
        name: 'Dark',
        algorithm: SwReactUI.darkAlgorithm,
        customTokens: (token) => (token),
        generateExtraTokens: (token) => {
            return {...genDefaultExtraTokens(token)};
        },
        logoMap: defaultLogoMap
    },
    [ThemeNames.LIGHT]: {
        id: ThemeNames.LIGHT,
        name: 'Light',
        algorithm: SwReactUI.darkAlgorithm,
        customTokens: (token) => (token),
        generateExtraTokens: (token) => {
            return {...genDefaultExtraTokens(token)};
        },
        logoMap: defaultLogoMap
    },
    [ThemeNames.SUBSPACE]: {} as SwThemeConfig
};

// Todo: Replace tokens with Subspace color schema
SW_THEME_CONFIGS[ThemeNames.SUBSPACE] = {...SW_THEME_CONFIGS[ThemeNames.LIGHT]};

export function generateTheme({
                                  customTokens,
                                  generateExtraTokens,
                                  id,
                                  logoMap,
                                  name
                              }: SwThemeConfig, token: GlobalToken): Theme {
    return {
        id,
        name,
        token: customTokens(token),
        extendToken: generateExtraTokens(token),
        logoMap
    } as Theme;
}
