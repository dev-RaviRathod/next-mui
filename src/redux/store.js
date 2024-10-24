"use client";

import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
} from "redux-persist";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import post from "./post";

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  post: post,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Optional: can disable serializable check if you have issues with non-serializable values in the state
    }),

});

const persister = persistStore(store);

export { store, persister };

