// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {createContext, useCallback, useState} from "react";
interface AppContextProps {
  children: React.ReactNode | React.ReactNode[]
}
type _AppContext = {
    title: string | React.ReactNode;
    setTitle: (title: string | React.ReactNode) => void;
    showBackButtonOnHeader?: boolean;
    setShowBackButtonOnHeader: (show?: boolean) => void;
    onBack?: VoidFunction;
    setOnBack: (func?: VoidFunction) => void;
}
export const AppContext = createContext({} as _AppContext);
export function AppStateProvider({children}: AppContextProps): React.ReactElement<AppContextProps> {
  const [showBackButtonOnHeader, setShowBackButtonOnHeader] = useState<boolean | undefined>(undefined);
  const [title, setTitle] = useState<string | React.ReactNode>('');
  const [onBack, _setOnBack] = useState<VoidFunction | undefined>(undefined);

  const setOnBack = useCallback((func?: VoidFunction) => {
    _setOnBack(() => {
      return func;
    });
  }, []);

  return (
    <AppContext.Provider value={{
        title,
        setTitle,
        showBackButtonOnHeader,
        setShowBackButtonOnHeader,
        onBack,
        setOnBack,
    }}>
      {children}
    </AppContext.Provider>
  );
}
