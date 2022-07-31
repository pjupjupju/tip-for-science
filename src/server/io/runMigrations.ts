import AWS from 'aws-sdk';

async function runMigrations() {
  const database = new AWS.DynamoDB(
    process.env.NODE_ENV === 'production'
      ? { region: 'eu-central-1 ' }
      : { endpoint: 'http://localhost:8000', region: 'eu-central-1' }
  );
  await database
    .listTables()
    .promise()
    .then((data) => console.log('dynamo tables: ', data.TableNames));
}

export { runMigrations };
