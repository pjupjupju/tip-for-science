import React, { createContext, useContext, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import arMessages from './translations/ar.json';
import aryMessages from './translations/ary.json';
import bgMessages from './translations/bg.json';
import cebMessages from './translations/ceb.json';
import csMessages from './translations/cs.json';
import deMessages from './translations/de.json';
import elMessages from './translations/el.json';
import esMessages from './translations/es.json';
import huMessages from './translations/hu.json';
import jaMessages from './translations/ja.json';
import koMessages from './translations/ko.json';
import plMessages from './translations/pl.json';
import skMessages from './translations/sk.json';
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
  ar: arMessages,
  ary: aryMessages,
  bg: bgMessages,
  ceb: cebMessages,
  cs: csMessages,
  de: deMessages,
  el: elMessages,
  es: esMessages,
  hu: huMessages,
  ja: jaMessages,
  ko: koMessages,
  pl: plMessages,
  sk: skMessages,
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
