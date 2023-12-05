
import { combineReducers, configureStore } from '@reduxjs/toolkit/dist';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import ChainStoreReducer from './base/ChainStore';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: storage,
};

const rootReducers = combineReducers({
  chainStore: ChainStoreReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type StoreName = keyof RootState
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
