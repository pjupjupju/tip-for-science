import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import csMessages from './translations/cs.json';

declare global {
  interface Window {
    __INITIAL_LANGUAGE__?: string;
  }
}

export const DEFAULT_LANGUAGE = 'en';

const messages = {
  cs: csMessages,
};

interface LanguageProviderProps {
  children: React.ReactNode;
  storage?: Storage;
  serverLanguage?: string;
}

const LanguageProvider = ({
  serverLanguage,
  storage,
  children,
}: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string | null>(
    serverLanguage || window.__INITIAL_LANGUAGE__ || DEFAULT_LANGUAGE
  );

  useEffect(() => {
    if (storage) {
      // Attempt to retrieve language from localStorage first
      let storedLanguage = storage.getItem('userLanguage');

      if (!storedLanguage) {
        storedLanguage = window.__INITIAL_LANGUAGE__ || DEFAULT_LANGUAGE;
        storage.setItem('userLanguage', storedLanguage);
      }
      setLanguage(storedLanguage);
    } else {
      setLanguage(serverLanguage);
    }
  }, [storage, serverLanguage]);

  return (
    <IntlProvider
      locale={language}
      defaultLocale={DEFAULT_LANGUAGE}
      messages={messages[language]}
    >
      {children}
    </IntlProvider>
  );
};

export { LanguageProvider };
