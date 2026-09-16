import React, { createContext, useContext, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import csMessages from './translations/cs.json';
import plMessages from './translations/pl.json';
import { useQuery } from '@apollo/client';
import { AUTH_QUERY } from './gql/authQuery';
import { DEFAULT_LANGUAGE, getUserLanguage } from './language';

declare global {
  interface Window {
    __INITIAL_LANGUAGE__?: string;
  }
}

export { DEFAULT_LANGUAGE } from './language';

const messages = {
  cs: csMessages,
  pl: plMessages,
};

interface LanguageProviderProps {
  children: React.ReactNode;
  serverLanguage?: string;
}

interface LanguageContextValue {
  language: string;
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
  children,
}: LanguageProviderProps) => {
  const { data } = useQuery(AUTH_QUERY, { fetchPolicy: 'cache-first' });
  const user = data?.viewer?.user;
  const language = user
    ? getUserLanguage(user.language)
    : getInitialLanguage(serverLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language }}>
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
