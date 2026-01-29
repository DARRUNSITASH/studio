'use client';

import { I18nProvider } from '@/context/I18nProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <I18nProvider>{children}</I18nProvider>
  );
}
