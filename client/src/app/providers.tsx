"use client";

import { SessionProvider } from 'next-auth/react';
import { QueryProvider } from '../lib/react-query/provider';
import { SettingsProvider } from '../context/SettingsContext';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SettingsProvider>
        <QueryProvider>{children}</QueryProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}
