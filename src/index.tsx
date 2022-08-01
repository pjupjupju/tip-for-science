import http from 'http';
import { Application } from 'express';

const env = process.env.NODE_ENV;

if (env === 'production') {
  /* Sentry.init({
    dsn: ...
  }); */
}

let { createServer } = require('./server');

let currentApp: Application;
let server: http.Server;

async function startServer(creator: any, listen: boolean) {
  const createdApp = await creator();

  if (listen) {
    server = http.createServer(createdApp);
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
  }

  return createdApp;
}

startServer(createServer, true)
  .then((a) => {
    currentApp = a;
  })
  .catch((e) => console.log(e));

// @ts-ignore
if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  // @ts-ignore
  module.hot.accept('./server', async () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      createServer = require('./server').createServer;
      const newApp = await startServer(createServer, false);

      server.removeListener('request', currentApp);
      server.on('request', newApp);
      currentApp = newApp;
    } catch (error) {
      console.error(error);
    }
  });
}
