'use client';

import { I18nProvider } from '@/context/I18nProvider';
import { AppProvider } from '@/context/AppContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <I18nProvider>{children}</I18nProvider>
    </AppProvider>
  );
}
