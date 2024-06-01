import path from 'path';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloServer } from 'apollo-server-express';
import { SchemaLink } from '@apollo/client/link/schema';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import { DynamoDB } from 'aws-sdk';
import { renderStylesToString } from 'emotion-server';
import { ThemeProvider } from 'emotion-theming';
import { ChunkExtractor } from '@loadable/server';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom/server';
import express from 'express';
import expressSession from 'express-session';
import createSessionFileStore from 'session-file-store';
import { renderToString } from 'react-dom/server';
import { resolve } from 'path';
import { App } from '../App';
import { Document } from './Document';
import { DynamoSessionStore, RunCache, RunLock, runMigrations } from './io';
import { createContext, typeDefs, resolvers, schema } from './schema';
import { tipForScienceTheme } from '../theme';
import { AWS_REGION, TABLE_SESSION } from '../config';
import csMessages from '../translations/cs.json';

const messages = {
  cs: csMessages,
};

// eslint-disable-next-line import/no-dynamic-require
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const env = process.env.NODE_ENV;

export async function createServer(): Promise<express.Application> {
  const server = express();

  // DynamoDB bootstrapping tables
  await runMigrations();

  const dynamo = new DynamoDB.DocumentClient(
    env === 'production'
      ? { region: AWS_REGION }
      : {
          endpoint: 'http://localhost:8000',
          region: AWS_REGION,
        }
  );

  const runCache = new RunCache(15, 5, { dynamo });
  const runLock = new RunLock();

  const staticDir =
    env === 'production'
      ? resolve(__dirname, './public')
      : process.env.RAZZLE_PUBLIC_DIR;

  const app = new ApolloServer({
    context: createContext({ dynamo, runCache, runLock }),
    debug: env !== 'production',
    playground: env !== 'production',
    formatError(error) {
      // Sentry.captureException(error);

      console.log(error);

      return {
        message: 'Error',
        path: error.path,
      };
    },
    typeDefs,
    resolvers,
    uploads: true,
  });

  server
    .disable('x-powered-by')
    .disable('etag')
    .set('trust proxy', true)
    .use(
      expressSession({
        store:
          env !== 'production'
            ? (new (createSessionFileStore(expressSession as any))() as any)
            : new DynamoSessionStore({ dynamo, tableName: TABLE_SESSION }),
        cookie: {
          // set max age to 90 days in ms
          maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
          secure: env === 'production',
        },
        secret: [
          '78831e16-4064-4216-8ea3-ebbe646fd3ff',
          'f181b705-4239-47a9-ae68-4aa9917e9114',
          '994d3d3d-6323-41c7-94cf-acfe0e384c93',
        ],
        resave: false,
        name: 'tipforsciencesid',
        saveUninitialized: false,
      })
    )
    .use(
      express.static(staticDir, {
        etag: false,
        immutable: true,
        maxAge: '30days',
      })
    );

  Sentry.init({
    dsn: 'https://b480280810f9447ab512f4519fe32aed@o1163471.ingest.sentry.io/6251598',
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app: server }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  server.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  server.use(Sentry.Handlers.tracingHandler());

  app.applyMiddleware({ app: server, path: '/api' });

  server.get('/*', async (req, res, next) => {
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    try {
      const createApolloContext = createContext({
        dynamo,
        runCache,
        runLock,
      });
      const context = await createApolloContext({ req, res });
      const client = new ApolloClient({
        cache: new InMemoryCache(),
        ssrMode: true,
        link: new SchemaLink({
          schema,
          context,
        }),
      });

      const extractor = new ChunkExtractor({
        statsFile: path.resolve('build/loadable-stats.json'),
        // razzle client bundle entrypoint is client.js
        entrypoints: ['client'],
      });

      const bootstrap = extractor.collectChunks(
        <StaticRouter location={req.url || '/'}>
          <IntlProvider locale="cs" defaultLocale="en" messages={messages.cs}>
            <ApolloProvider client={client}>
              <ThemeProvider theme={tipForScienceTheme}>
                <App />
              </ThemeProvider>
            </ApolloProvider>
          </IntlProvider>
        </StaticRouter>
      );

      const result = await renderToStringWithData(bootstrap);

      const initialState = client.extract();

      // collect script tags
      const scriptTags = extractor.getScriptElements();

      // collect "preload/prefetch" links
      const linkTags = extractor.getLinkElements();

      // collect style tags
      const styleTags = extractor.getStyleElements();

      const helmet = Helmet.renderStatic();

      // TODO: fix ANY
      const cssLinksFromAssets = (assets: any, entrypoint: any): string => {
        return assets[entrypoint]
          ? assets[entrypoint].css
            ? assets[entrypoint].css.map((asset: string) => (
                <link rel="stylesheet" href={asset} />
              ))
            : ''
          : '';
      };

      res
        .status(200)
        .send(
          `<!doctype html>${renderToString(
            <Document
              content={renderStylesToString(result)}
              helmet={helmet}
              css={cssLinksFromAssets(assets, 'client')}
              state={initialState}
              linkTags={linkTags}
              styleTags={styleTags}
              scriptTags={scriptTags}
            />
          )}`
        );
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

  return server;
}
