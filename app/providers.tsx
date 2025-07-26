'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { SessionProvider } from 'next-auth/react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ProgressProvider
        height="4px"
        color="#418bd1"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </SessionProvider>
  );
};

export default Providers;