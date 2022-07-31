import http from 'http';

const env = process.env.NODE_ENV;

if (env === 'production') {
  /* Sentry.init({
    dsn: ...
  }); */
}

let app = require('./server').default;

let currentApp = app;

const server = http.createServer(app);

server
  .listen(process.env.PORT || 3000, () => {
    console.log(
      `🚀 server running at http://localhost:${process.env.PORT || 3000}`
    );

    if (env === 'production') {
      const gracefulShutdown = async (signal: NodeJS.Signals) => {
        console.log(`Received signal ${signal}, shutting down gracefully`);

        try {
          await Promise.race([
            new Promise((_, rej) =>
              setTimeout(() => rej(new Error('Forced shutdown')), 10000)
            ),
            new Promise<void>((r) => server.close(() => r())),
          ]);

          process.exit(0);
        } catch (e) {
          console.log(e);
          process.exit(1);
        }
      };

      process.on('SIGINT', gracefulShutdown);
      process.on('SIGTERM', gracefulShutdown);
    }
  })
  .on('error', (error) => {
    console.log(error);
  });

// @ts-ignore
if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  // @ts-ignore
  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
