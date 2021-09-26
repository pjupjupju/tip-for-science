import { DynamoDB } from 'aws-sdk';
import { TABLE_USER, USERS_BY_EMAIL_INDEX, USERS_BY_SLUG_INDEX } from '../src/config';

// create table if does not exist
const config: DynamoDB.ClientConfiguration =
  process.env.NODE_ENV === 'production'
    ? {}
    : {
        endpoint: 'http://localhost:8000',
        region: 'eu-central-1',
      };

const db = new DynamoDB(config);

async function migrate() {
  const tables = await db.listTables().promise();

  if (tables.TableNames && !tables.TableNames.includes(TABLE_USER)) {
    await db
      .createTable({
        TableName: TABLE_USER,
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'email', AttributeType: 'S' },
          { AttributeName: 'slug', AttributeType: 'S' },
        ],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        GlobalSecondaryIndexes: [
          {
            IndexName: USERS_BY_EMAIL_INDEX,
            KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
            Projection: {
              ProjectionType: 'ALL',
            },
          },
          {
            IndexName: USERS_BY_SLUG_INDEX,
            KeySchema: [{ AttributeName: 'slug', KeyType: 'HASH' }],
            Projection: {
              ProjectionType: 'ALL',
            },
          },
        ],
      })
      .promise();
  }
}

migrate()
  .then(() => {
    console.log('Migration done.');
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
