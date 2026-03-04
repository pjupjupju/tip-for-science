import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import csMessages from './translations/cs.json';
import plMessages from './translations/pl.json';

declare global {
  interface Window {
    __INITIAL_LANGUAGE__?: string;
  }
}

export const DEFAULT_LANGUAGE = 'en';

const messages = {
  cs: csMessages,
  pl: plMessages,
};

interface LanguageProviderProps {
  children: React.ReactNode;
  storage?: Storage;
  serverLanguage?: string;
}

interface LanguageContextValue {
  language: string;
  changeLanguage: (nextLanguage: string) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const getInitialLanguage = (serverLanguage?: string): string => {
  if (serverLanguage) {
    return serverLanguage;
  }

  if (typeof window !== 'undefined' && window.__INITIAL_LANGUAGE__) {
    return window.__INITIAL_LANGUAGE__;
  }

  return DEFAULT_LANGUAGE;
};

const LanguageProvider = ({
  serverLanguage,
  storage,
  children,
}: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string>(getInitialLanguage(serverLanguage));

  const persistLanguage = useCallback(
    (nextLanguage: string) => {
      if (storage) {
        storage.setItem('userLanguage', nextLanguage);
      }
    },
    [storage]
  );

  const changeLanguage = useCallback(
    (nextLanguage: string) => {
      setLanguage(nextLanguage);
      persistLanguage(nextLanguage);
    },
    [persistLanguage]
  );

  useEffect(() => {
    if (storage) {
      // Attempt to retrieve language from localStorage first
      let storedLanguage = storage.getItem('userLanguage');

      if (!storedLanguage) {
        storedLanguage = getInitialLanguage(serverLanguage);
      }
      changeLanguage(storedLanguage);
    } else {
      setLanguage(getInitialLanguage(serverLanguage));
    }
  }, [storage, serverLanguage, changeLanguage]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      <IntlProvider
        locale={language}
        defaultLocale={DEFAULT_LANGUAGE}
        messages={messages[language]}
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};

export { LanguageProvider, useLanguage };
