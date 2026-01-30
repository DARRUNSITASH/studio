'use client';

import { createContext, useState, useMemo, ReactNode } from 'react';
import en from '@/messages/en.json';
import hi from '@/messages/hi.json';
import ta from '@/messages/ta.json';

type Locale = 'en' | 'hi' | 'ta';

type Translations = { [key: string]: string };

type I18nContextType = {
  locale: Locale;
  enabledLocales: Locale[];
  setLocale: (locale: Locale) => void;
  toggleLocale: (locale: Locale) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
};

export const I18nContext = createContext<I18nContextType | null>(null);

const messages: Record<Locale, Translations> = {
  en,
  hi,
  ta,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [enabledLocales, setEnabledLocales] = useState<Locale[]>(['en', 'hi', 'ta']);

  const toggleLocale = (target: Locale) => {
    if (target === 'en') return; // English is mandatory

    setEnabledLocales(prev => {
      if (prev.includes(target)) {
        const next = prev.filter(l => l !== target);
        if (locale === target) setLocale('en'); // Switch to fallback if current is disabled
        return next;
      } else {
        return [...prev, target];
      }
    });
  };

  const t = useMemo(
    () => (key: string, replacements?: { [key: string]: string | number }) => {
      let translation = messages[locale][key] || key;
      if (replacements) {
        Object.keys(replacements).forEach(rKey => {
          const regex = new RegExp(`{${rKey}}`, 'g');
          translation = translation.replace(regex, String(replacements[rKey]));
        });
      }
      return translation;
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      enabledLocales,
      setLocale,
      toggleLocale,
      t,
    }),
    [locale, enabledLocales, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
