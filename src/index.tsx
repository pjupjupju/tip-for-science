import http from 'http';

if (process.env.NODE_ENV === 'production') {
  /* Sentry.init({
    dsn: ...
  }); */
}

let app = require('./server').default;

let currentApp = app;

const server = http.createServer(app);

server
  .listen(process.env.PORT || 3000, () => {
    console.log('🚀 server running at http://localhost:3000');
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
