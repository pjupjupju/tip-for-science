import { DynamoDB } from 'aws-sdk';
import {
  AWS_REGION,
  PLAYERS_BY_HIGHSCORE,
  TABLE_QUESTION,
  TABLE_SESSION,
  TABLE_USER,
  USERS_BY_EMAIL_INDEX,
  USERS_BY_SLUG_INDEX,
} from '../../config';

const env = process.env.NODE_ENV;

async function runMigrations() {
  const database = new DynamoDB(
    env === 'production'
      ? { region: AWS_REGION }
      : { endpoint: 'http://localhost:8000', region: AWS_REGION }
  );
  const { TableNames: tables } = await database.listTables().promise();

  if (tables.length === 0 && env === 'production') {
    await migrate(database, tables);
  }

  return tables;
}

async function migrate(db, tables) {
  if (tables && !tables.includes(TABLE_USER)) {
    await db
      .createTable({
        TableName: TABLE_USER,
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'role', AttributeType: 'S' },
          { AttributeName: 'email', AttributeType: 'S' },
          { AttributeName: 'score', AttributeType: 'N' },
          { AttributeName: 'slug', AttributeType: 'S' },
          { AttributeName: 'userskey', AttributeType: 'S' },
        ],
        KeySchema: [
          { AttributeName: 'id', KeyType: 'HASH' },
          { AttributeName: 'userskey', KeyType: 'RANGE' },
        ],
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
          {
            IndexName: PLAYERS_BY_HIGHSCORE,
            KeySchema: [
              { AttributeName: 'role', KeyType: 'HASH' },
              { AttributeName: 'score', KeyType: 'RANGE' },
            ],
            Projection: {
              ProjectionType: 'INCLUDE',
              NonKeyAttributes: ['score', 'slug'],
            },
          },
        ],
      })
      .promise();
  }

  if (tables && !tables.includes(TABLE_QUESTION)) {
    await db
      .createTable({
        TableName: TABLE_QUESTION,
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'qsk', AttributeType: 'S' },
          { AttributeName: 'gsi_pk', AttributeType: 'S' },
          { AttributeName: 'gsi_sk', AttributeType: 'S' },
        ],
        KeySchema: [
          { AttributeName: 'id', KeyType: 'HASH' },
          { AttributeName: 'qsk', KeyType: 'RANGE' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'QER_GSI',
            KeySchema: [
              { AttributeName: 'gsi_pk', KeyType: 'HASH' },
              { AttributeName: 'gsi_sk', KeyType: 'RANGE' },
            ],
            Projection: {
              ProjectionType: 'ALL',
            },
          },
        ],
      })
      .promise();
  }

  if (tables && !tables.includes(TABLE_SESSION)) {
    await db
      .createTable({
        TableName: TABLE_SESSION,
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      })
      .promise();
  }
}

export { runMigrations };
