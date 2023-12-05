
import { ModalContext, useExcludeModal } from '@subwallet/react-ui';
import React, { useCallback, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
interface Props {
  children: React.ReactNode;
}

export const PREDEFINED_MODAL_NAMES = ['debugger', 'transaction', 'confirmations'];
type PredefinedModalName = typeof PREDEFINED_MODAL_NAMES[number];

export const usePredefinedModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const openPModal = useCallback((name: PredefinedModalName | null) => {
    setSearchParams((prev) => {
      if (name) {
        prev.set('popup', name);
      } else {
        prev.delete('popup');
      }

      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  const isOpenPModal = useCallback(
    (popupName?: string) => {
      const currentPopup = searchParams.get('popup');

      if (popupName) {
        return currentPopup === popupName;
      } else {
        return !!currentPopup;
      }
    },
    [searchParams]
  );

  return { openPModal, isOpenPModal };
};

export const WalletModalContext = ({ children }: Props) => {
  const navigate = useNavigate();
  const { activeModal, hasActiveModal, inactiveAll, inactiveModals } = useContext(ModalContext);
  const [searchParams, setSearchParams] = useSearchParams();
  return <>
    <div
      id='popup-container'
      style={{ zIndex: hasActiveModal ? undefined : -1 }}
    />
    {children}
  </>;
};
