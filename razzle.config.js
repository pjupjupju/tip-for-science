const LoadableWebpackPlugin = require("@loadable/webpack-plugin");
const path = require("path");

const appSrc = path.resolve(__dirname, './src');

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    // add loadable webpack plugin only
    // when we are building the client bundle
    if (opts.env.target === "web") {
      const filename = path.resolve(__dirname, "build");

      // saving stats file to build folder
      // without this, stats files will go into
      // build/public folder
      config.plugins.push(
        new LoadableWebpackPlugin({
          outputAsset: false,
          writeToDisk: { filename },
        })
      );
    }
    return config;
  },
  modify: (config, { dev, target }) => {
    let resConfig =
      target === 'web'
        ? {
            ...config,
            plugins: [...config.plugins],
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
          ? (info) =>
              path
                .relative(appSrc, info.absoluteResourcePath)
                .replace(/\\/g, '/')
          : (info) =>
              path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
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
