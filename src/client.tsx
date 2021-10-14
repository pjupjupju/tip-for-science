import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
// import * as Sentry from '@sentry/browser';
// @ts-ignore
import { createUploadLink } from 'apollo-upload-client';
import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import fetch from 'unfetch';
import { App } from './App';
import { tipForScienceTheme } from './theme';

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
