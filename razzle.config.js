const path = require('path');
const { ReactLoadablePlugin } = require('react-loadable/webpack');

const appSrc = path.resolve(__dirname, './src');

module.exports = {
  modify: (config, { dev, target }) => {
    let resConfig =
      target === 'web'
        ? {
            ...config,
            plugins: [
              ...config.plugins,
              new ReactLoadablePlugin({
                filename: './build/react-loadable.json',
              }),
            ],
          }
        : {
            ...config,
            plugins: [...config.plugins],
          };

    const babelRule = resConfig.module.rules[1];
    babelRule.test = /\.(js|mjs|jsx|ts|tsx)$/;

    if (!dev) {
      resConfig =
        target === 'web'
          ? {
              ...config,
              plugins: [
                ...config.plugins,
                /* new SentryWebpackPlugin({
                  include: './build',
                  ignoreFile: '.sentrycliignore',
                  ignore: ['node_modules', 'webpack.config.js'],
                }), */
              ],
            }
          : {
              ...config,
              plugins: [
                ...config.plugins,
                /* new SentryWebpackPlugin({
                  include: './build',
                  ignoreFile: '.sentrycliignore',
                  ignore: ['node_modules', 'webpack.config.js'],
                }), */
              ],
            };
    }

    return {
      ...resConfig,
      output: {
        ...resConfig.output,
        devtoolModuleFilenameTemplate: dev
          ? info =>
              path
                .relative(appSrc, info.absoluteResourcePath)
                .replace(/\\/g, '/')
          : info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
      },
      resolve: {
        ...resConfig.resolve,
        extensions: ['.ts', '.tsx', '.mjs', '.jsx', '.js', '.json'],
      },
      module: {
        ...resConfig.module,
        rules: [
          {
            test: /\.svg$/,
            use: ['@svgr/webpack', 'url-loader'],
          },
          ...resConfig.module.rules,
        ],
      },
    };
  },
};