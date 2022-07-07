import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
// @ts-ignore
import { createUploadLink } from 'apollo-upload-client';
import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import fetch from 'unfetch';
import { App } from './App';
import { tipForScienceTheme } from './theme';

Sentry.init({
  dsn: "https://f68510b1330f420eaffce1b7bc357e1f@o1163471.ingest.sentry.io/6251596",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});


/* if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: ...
  });
} */

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
    <ApolloProvider client={client}>
      <ThemeProvider theme={tipForScienceTheme}>
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
