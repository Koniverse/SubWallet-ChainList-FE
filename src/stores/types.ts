// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0


import {Chain} from "../types/dataType";

export enum ReduxStatus {
  INIT = 'init',
  CACHED = 'cached',
  READY = 'ready'
}

export interface BaseReduxStore {
  reduxStatus: ReduxStatus
}


export interface ChainStore extends BaseReduxStore {
  chainList: Chain[],
}
