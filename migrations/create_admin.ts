import { DynamoDB } from 'aws-sdk';
import { hashSync } from 'bcryptjs';
import { ulid } from 'ulid';
import {
  TABLE_USER, USERS_BY_EMAIL_INDEX
} from '../src/config';
import { User, UserRole } from '../src/server/model/types';

const db = new DynamoDB.DocumentClient(
  process.env.NODE_ENV === 'production'
    ? {}
    : {
        endpoint: 'http://localhost:8000',
        region: 'eu-central-1',
      },
);

async function createUser() {
  const [email] = process.argv.slice(2);
  const [pwd] = process.argv.slice(3);

  if (email == null) {
    throw new Error('Please provide an email');
  }

  const id = ulid();
  const password = pwd ? pwd : ulid();
  const user: User = {
    createdAt: new Date().toISOString(),
    id,
    userskey: `USER#${id}`,
    email: email.toLowerCase(),
    password: hashSync(password, 10),
    role: UserRole.admin,
    slug: id,
    updatedAt: new Date().toISOString(),
    score: 0,
  };


  const dbUser = await db
    .query({
      IndexName: USERS_BY_EMAIL_INDEX,
      TableName: TABLE_USER,
      KeyConditionExpression: 'email = :email',
      ProjectionExpression: 'id',
      ExpressionAttributeValues: {
        ':email': user.email,
      },
    })
    .promise();

  if (dbUser.Count == null) {
    throw new Error('Unknown error');
  }

  if (dbUser.Count > 0) {
    throw new Error('User already exists');
  }

  await db
    .put({
      TableName: TABLE_USER,
      Item: user,
    })
    .promise();

  console.log(
    `✅ Admin user ${user.id} (${user.email}) has been created with password ${password} 🔑.`,
  );
}

createUser()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
