// Copyright 2019-2023 @subwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import Chain from "./pages/Chain";
import ChainDetail from "./pages/Chain/ChainDetail";
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: (<Chain/>)
      },
      {
        path: '/chain/:slug',
        element: (<ChainDetail/>)
      },
    ]
  },
])
