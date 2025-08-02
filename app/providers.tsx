'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { SessionProvider } from 'next-auth/react';
import { Provider } from "react-redux"
import { store } from "@/store/store"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ProgressProvider
          height="4px"
          color="#418bd1"
          options={{ showSpinner: false }}
          shallowRouting
        >
          {children}
        </ProgressProvider>
      </Provider>
    </SessionProvider>
  );
};

export default Providers;