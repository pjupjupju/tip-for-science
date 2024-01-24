import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { getDataFromTree } from '@apollo/react-ssr';
import { ApolloServer } from 'apollo-server-express';
import { SchemaLink } from '@apollo/client/link/schema';
import { DynamoDB } from 'aws-sdk';
import { renderStylesToString } from 'emotion-server';
import { ThemeProvider } from 'emotion-theming';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Helmet } from 'react-helmet';
import { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import expressSession from 'express-session';
import createSessionFileStore from 'session-file-store';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
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
      const client = new ApolloClient({
        cache: new InMemoryCache(),
        ssrMode: true,
        link: new SchemaLink({ schema }),
      });
      const context: StaticRouterContext = {};
      const bootstrap = (
        <StaticRouter context={context} location={req.url || '/'}>
          <IntlProvider locale="cs" defaultLocale="en" messages={messages.cs}>
            <ApolloProvider client={client}>
              <ThemeProvider theme={tipForScienceTheme}>
                <App />
              </ThemeProvider>
            </ApolloProvider>
          </IntlProvider>
        </StaticRouter>
      );

      await getDataFromTree(bootstrap);

      const markup = renderStylesToString(renderToString(bootstrap));
      const helmet = Helmet.renderStatic();
      const initialState = client.extract();

      const cssLinksFromAssets = (assets, entrypoint): string => {
        return assets[entrypoint]
          ? assets[entrypoint].css
            ? assets[entrypoint].css.map((asset) => (
              <link rel="stylesheet" href={asset} />
            ))
            : ''
          : '';
      };

      if (context.url) {
        res.redirect(context.url);
      } else {
        res
          .status(context.statusCode || 200)
          .send(
            `<!doctype html>${renderToStaticMarkup(
              <Document
                content={markup}
                helmet={helmet}
                css={cssLinksFromAssets(assets, 'client')}
                js={assets.client.js}
                state={initialState}
              />
            )}`
          );
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

  return server;
}
