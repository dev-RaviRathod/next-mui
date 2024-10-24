"use client";

import { Provider } from "react-redux";
// import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { store, persister } from "./store";

// eslint-disable-next-line react/prop-types
export function Providers({ children }) {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        {children}
      </PersistGate>
    </Provider>
  );
}
