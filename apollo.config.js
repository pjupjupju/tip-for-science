const { resolve } = require('path');

module.exports = {
  client: {
    excludes: ['**/src/server/**/*'],
    service: {
      name: 'TipForScience App GraphQL',
      localSchemaFile: resolve(__dirname, './schema.graphql'),
    },
  },
};