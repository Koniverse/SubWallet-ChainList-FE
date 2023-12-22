// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getWalletBySource } from '@subwallet/wallet-connect/dotsama/wallets';
import { getEvmWalletBySource } from '@subwallet/wallet-connect/evm/evmWallets';
import { EvmWallet, Wallet, WalletAccount } from '@subwallet/wallet-connect/types';
import React, {useCallback, useContext, useEffect, useState} from "react";
import  {SELECT_WALLET_MODAL_ID} from "../components/Modal/Wallet/SelectWalletModal";
import {ModalContext} from "@subwallet/react-ui";
import {useLocalStorage} from "../hooks/useLocalStorage";

export interface WalletContextInterface {
  wallet?: Wallet,
  evmWallet?: EvmWallet,
  accounts: WalletAccount[],
  setWallet: (wallet: Wallet | EvmWallet | undefined, walletType: 'substrate'|'evm') => void
  walletType: 'substrate'|'evm';
}

export const WalletContext = React.createContext<WalletContextInterface>({
  accounts: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setWallet: (wallet, walletType: 'substrate'|'evm') => {},
  walletType: 'substrate'
});

interface OpenSelectWalletInterface {
  isOpen: boolean,
  open: () => void
  close: () => void
}

export const OpenSelectWallet = React.createContext<OpenSelectWalletInterface>({
  isOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  open: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close: () => {}
});


interface Props{
  children: React.ReactElement;
}

export function WalletContextProvider ({ children }: Props) {

  const [walletKey, setWalletKey] = useLocalStorage('wallet-key');
  const [walletType, setWalletType] = useLocalStorage('wallet-type', 'substrate');
  const {activeModal, inactiveModal} = useContext(ModalContext);
  const [currentWallet, setCurrentWallet] = useState<Wallet | EvmWallet | undefined>(getWalletBySource(walletKey));
  const [isSelectWallet, setIsSelectWallet] = useState(false);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);

  const afterSelectWallet = useCallback(
    async (wallet: Wallet) => {
      const infos = await wallet.getAccounts();
      console.log('infos', infos)
      infos && setAccounts(infos);
    },
    []
  );

  const selectWallet = useCallback(
    async (wallet: Wallet) => {
      setCurrentWallet(currentWallet);
      await wallet.enable();
      setWalletKey(wallet.extensionName);

      await afterSelectWallet(wallet);
    },
    [afterSelectWallet, currentWallet]
  );

  const afterSelectEvmWallet = useCallback(
    async (wallet: EvmWallet) => {
      await wallet?.enable(); // Quick call extension?.request({ method: 'eth_requestAccounts' });
    },
    []
  );

  const selectEvmWallet = useCallback(
    async (wallet: EvmWallet) => {
      await afterSelectEvmWallet(wallet);

      setCurrentWallet(currentWallet);

      setWalletKey(wallet.extensionName);
      //
      // windowReload();
    },
    [afterSelectEvmWallet, currentWallet]
  );

  const walletContext = {
    wallet: getWalletBySource('walletKey'),
    evmWallet: getEvmWalletBySource('walletKey'),
    accounts,
    setWallet: (wallet: Wallet | EvmWallet | undefined, walletType: 'substrate' | 'evm') => {
      if (walletType === 'substrate') {
        wallet && selectWallet(wallet as Wallet);
      } else {
        wallet && selectEvmWallet(wallet as EvmWallet);
      }

      wallet && setWalletType(walletType);
    },
    walletType: 'substrate'
  };

  const selectWalletContext = {
    isOpen: isSelectWallet,
    open: () => {
      activeModal(SELECT_WALLET_MODAL_ID);
      setIsSelectWallet(true);
    },
    close: () => {
      inactiveModal(SELECT_WALLET_MODAL_ID);
      setIsSelectWallet(false);
    }
  };

  useEffect(
    () => {
      if (walletType === 'substrate') {
        const wallet = getWalletBySource(walletKey);

        setTimeout(() => {
          if (wallet && wallet?.installed) {
            // eslint-disable-next-line no-void
            void afterSelectWallet(wallet);
          }
        }, 150);
      } else {
        const evmWallet = getEvmWalletBySource(walletKey);

        evmWallet && evmWallet?.isReady.then(() => {
          afterSelectEvmWallet(evmWallet).catch(console.error);
        });
      }
    },
    [afterSelectEvmWallet, afterSelectWallet, walletKey, walletType]
  );

  return <WalletContext.Provider value={walletContext as WalletContextInterface}>
    <OpenSelectWallet.Provider value={selectWalletContext}>
      {children}
    </OpenSelectWallet.Provider>
  </WalletContext.Provider>;
}
