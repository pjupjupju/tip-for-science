const LoadableWebpackPlugin = require("@loadable/webpack-plugin");
const path = require("path");

const appSrc = path.resolve(__dirname, './src');
const muiPath = path.resolve(__dirname, "node_modules/@mui");
const emotionPath = path.resolve(__dirname, "node_modules/@emotion");
const reactSpringPath = path.resolve(__dirname, 'node_modules/@react-spring');

function findBabelRule(rules) {
  for (const rule of rules) {
    if (!rule) continue;

    if (rule.oneOf) {
      const found = findBabelRule(rule.oneOf);
      if (found) return found;
    }

    if (rule.loader && rule.loader.includes("babel-loader")) return rule;

    if (rule.use) {
      const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
      for (const u of uses) {
        if (u && u.loader && u.loader.includes("babel-loader")) return rule;
      }
    }
  }
  return null;
}

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

    config.module.rules.unshift({
      test: /\.mjs$/,
      include: /node_modules\/@nivo/,
      type: 'javascript/auto',
    });

    const babelRule = findBabelRule(config.module.rules);
    if (!babelRule) {
      console.log("❌ Babel rule not found");
      return config;
    }

    babelRule.test = /\.(js|mjs|jsx|ts|tsx)$/;

    babelRule.include = [appSrc, muiPath, emotionPath, reactSpringPath];

    delete babelRule.exclude;

    return config;
  },
  // Probably deprecated TODO: remove is deploy ok with modifyWebpackConfig
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
    console.log('babelrule', babelRule);
    babelRule.include = [appSrc, muiPath, emotionPath];

    console.log(resConfig.module.rules)


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
