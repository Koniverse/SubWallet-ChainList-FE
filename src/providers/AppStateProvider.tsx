// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {AppContext} from "../contexts";
import React from "react";
export interface AppContextProps {
  children: React.ReactNode;
}

export function AppStateProvider({children}: AppContextProps): React.ReactElement<AppContextProps> {

  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  );
}
