import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
// @ts-ignore
import { createUploadLink } from 'apollo-upload-client';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import fetch from 'unfetch';
import { App } from './App';
import { tipForScienceTheme } from './theme';
import csMessages from './translations/cs.json';

const messages = {
  cs: csMessages,
};

Sentry.init({
  dsn: 'https://f68510b1330f420eaffce1b7bc357e1f@o1163471.ingest.sentry.io/6251596',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const client = new ApolloClient({
  cache: new InMemoryCache().restore((window as any).__D),
  link: createUploadLink({
    credentials: 'same-origin',
    fetch,
    uri: '/api',
  }),
});

hydrate(
  <BrowserRouter>
    <IntlProvider locale="en" defaultLocale="en">
      <ApolloProvider client={client}>
        <ThemeProvider theme={tipForScienceTheme}>
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </IntlProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
}
