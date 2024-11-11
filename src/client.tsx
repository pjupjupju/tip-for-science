import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { loadableReady } from '@loadable/component';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
// @ts-ignore
import { createUploadLink } from 'apollo-upload-client';
import React from 'react';
import { hydrateRoot, Root } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import fetch from 'unfetch';
import { App } from './App';
import { LanguageProvider } from './LanguageProvider';

declare global {
  interface Window {
    tfsRoot: Root;
  }
}

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

loadableReady().then(() => {
  const content = (
    <BrowserRouter>
      <LanguageProvider storage={localStorage}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </LanguageProvider>
    </BrowserRouter>
  );

  if (process.env.NODE_ENV === 'production') {
    hydrateRoot(document.getElementById('root'), content);
  } else {
    if (window.tfsRoot) {
      window.tfsRoot.render(content);
    } else {
      window.tfsRoot = hydrateRoot(document.getElementById('root'), content);
    }
  }
});

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
}
