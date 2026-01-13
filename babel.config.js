module.exports = {
  presets: [
    'razzle/babel',
  ],
  plugins: [
    '@loadable/babel-plugin',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-nullish-coalescing-operator',
    '@babel/plugin-transform-logical-assignment-operators',
  ],
};