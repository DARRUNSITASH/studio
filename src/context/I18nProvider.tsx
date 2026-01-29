'use client';

import { createContext, useState, useMemo, ReactNode } from 'react';
import en from '@/messages/en.json';
import hi from '@/messages/hi.json';
import ta from '@/messages/ta.json';

type Locale = 'en' | 'hi' | 'ta';

type Translations = { [key: string]: string };

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

export const I18nContext = createContext<I18nContextType | null>(null);

const messages: Record<Locale, Translations> = {
  en,
  hi,
  ta,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useMemo(
    () => (key: string) => {
      return messages[locale][key] || key;
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
