// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ChainStore, ReduxStatus} from "../types";
import {Chain} from "../../types/dataType";

const initialState: ChainStore = {
  chainList: [],
  reduxStatus: ReduxStatus.INIT
};

const chainStoreSlice = createSlice({
  initialState,
  name: 'chainStore',
  reducers: {
    addChain (state, action: PayloadAction<Chain[]>) {
      const { payload } = action;

      return {
        ...state,
        chainList: payload,
        reduxStatus: ReduxStatus.READY
      };
    },
  }
});

export const { addChain} = chainStoreSlice.actions;
export default chainStoreSlice.reducer;
