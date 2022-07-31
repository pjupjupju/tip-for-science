import AWS from 'aws-sdk';
import { AWS_REGION } from '../../config';

async function runMigrations() {
  const database = new AWS.DynamoDB(
    process.env.NODE_ENV === 'production'
      ? { region: AWS_REGION }
      : { endpoint: 'http://localhost:8000', region: AWS_REGION }
  );
  await database
    .listTables()
    .promise()
    .then((data) => console.log('dynamo tables: ', data.TableNames));
}

export { runMigrations };
