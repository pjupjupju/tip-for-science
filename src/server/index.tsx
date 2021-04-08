import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { getDataFromTree } from '@apollo/react-ssr';
import { ApolloServer } from 'apollo-server-express';
import { DynamoDB } from 'aws-sdk';
import { renderStylesToString } from '@emotion/server';
import React from 'react';
import { Helmet } from 'react-helmet';
import { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import expressSession from 'express-session';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { resolve } from 'path';
import { App } from '../App';
import { Document } from './Document';
import { createContext, typeDefs, resolvers } from './schema';

// eslint-disable-next-line import/no-dynamic-require
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

const dynamo = new DynamoDB.DocumentClient(
  process.env.NODE_ENV === 'production'
    ? {}
    : {
        endpoint: 'http://localhost:8000',
        region: 'eu-central-1',
      }
);

const staticDir =
  process.env.NODE_ENV === 'production'
    ? resolve(__dirname, './public')
    : process.env.RAZZLE_PUBLIC_DIR;

// server.use(Sentry.Handlers.requestHandler());
// server.use(Sentry.Handlers.errorHandler());

const app = new ApolloServer({
  context: createContext({ dynamo }),
  debug: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production',
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
      cookie: {
        // set max age to 90 days in ms
        maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
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
    });
    const context: StaticRouterContext = {};
    const bootstrap = (
      <StaticRouter
        context={context}
        location={req.url || '/'}
      >
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </StaticRouter>
    );

    await getDataFromTree(bootstrap);

    const markup = renderStylesToString(renderToString(bootstrap));
    const helmet = Helmet.renderStatic();
    const initialState = client.extract();

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

export default server;
