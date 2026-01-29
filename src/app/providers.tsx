'use client';

import { ThemeProvider } from 'next-themes';
import { I18nProvider } from '@/context/I18nProvider';
import { AppProvider } from '@/context/AppContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AppProvider>
        <I18nProvider>{children}</I18nProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
