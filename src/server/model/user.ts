import { DynamoDB } from 'aws-sdk';
import { ulid } from 'ulid';
import * as yup from 'yup';
import { TABLE_USER, USERS_BY_EMAIL_INDEX } from '../../config';
import { User, UserRole } from './types';

interface UserModelContext {
  dynamo: DynamoDB.DocumentClient;
}

export async function createUser(
  args: {
    email: string;
    password: string;
    role: UserRole;
  },
  { dynamo }: UserModelContext
) {
  const id = ulid();
  const user: User = {
    createdAt: new Date().toISOString(),
    email: args.email,
    id,
    userskey: `USER#${id}`,
    name: '',
    password: args.password,
    role: args.role,
    slug: id, // use id by default as user's slug
    updatedAt: new Date().toISOString(),
    score: 0,
  };

  // check if user does not exist
  const foundUser = await findUserByEmail(user.email, { dynamo });

  if (foundUser) {
    throw new yup.ValidationError('Email already exists', null, 'email');
  }

  await dynamo
    .transactWrite({
      TransactItems: ([
        // write user
        {
          Put: {
            TableName: TABLE_USER,
            Item: user,
          },
        },
      ] as (DynamoDB.DocumentClient.TransactWriteItem | undefined)[]).filter(
        Boolean
      ) as DynamoDB.DocumentClient.TransactWriteItem[],
    })
    .promise();

  return user;
}

export async function findUserById(
  id: string,
  { dynamo }: UserModelContext
): Promise<User | null> {
  const { Item } = await dynamo
    .get({
      TableName: TABLE_USER,
      Key: { id, userskey: `USER#${id}` },
    })
    .promise();

  return (Item as User) || null;
}

export async function findUserByEmail(
  email: string,
  { dynamo }: UserModelContext
): Promise<User | null> {
  const { Items } = await dynamo
    .query({
      TableName: TABLE_USER,
      IndexName: USERS_BY_EMAIL_INDEX,
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    })
    .promise();

  if (Items == null) {
    throw new Error('Uknown error');
  }

  return (Items[0] as User) || null;
}
