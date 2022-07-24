import { DynamoDB } from 'aws-sdk';
import { ulid } from 'ulid';
import * as yup from 'yup';
import { TABLE_USER, TABLE_QUESTION, USERS_BY_EMAIL_INDEX } from '../../config';
import { generateQuestionBundle } from '../../helpers';
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

  const { Items: questions } = await getQuestionCorpus(dynamo);

  const initialQuestions = questions
    .filter((q: any) => q.isInit)
    .map((q: any) => q.id);
  const restQuestions = questions
    .filter((q: any) => !q.isInit)
    .map((q: any) => q.id);
  const bundle = generateQuestionBundle(initialQuestions, restQuestions);

  const user: User = {
    bundle,
    createdAt: new Date().toISOString(),
    email: args.email,
    id,
    lastQuestion: null,
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

export async function updateQuestionBundle(
  userId: string,
  newQuestionList: string[],
  oldBundle: string[],
  { dynamo }: UserModelContext
): Promise<any> {
  const restBundle = generateQuestionBundle([], newQuestionList);

  const params = {
    TableName: TABLE_USER,
    Key: { id: userId, userskey: `USER#${userId}` },
    UpdateExpression: 'set bundle = :bundle, lastQuestion = :lastQuestion',
    ExpressionAttributeValues: {
      ':bundle': [...oldBundle, ...restBundle],
      ':lastQuestion': null,
    },
  };

  return dynamo.update(params).promise();
}

export async function updateLastQuestion(
  userId: string,
  newLastQuestion: string,
  { dynamo }: UserModelContext
): Promise<any> {
  const params = {
    TableName: TABLE_USER,
    Key: { id: userId, userskey: `USER#${userId}` },
    UpdateExpression: 'set lastQuestion = :newLastQuestion',
    ExpressionAttributeValues: {
      ':newLastQuestion': newLastQuestion,
    },
  };

  return dynamo.update(params).promise();
}

export async function updateScore(
  userId: string,
  scoreAddition: number,
  { dynamo }: UserModelContext
): Promise<any> {
  const params = {
    TableName: TABLE_USER,
    Key: { id: userId, userskey: `USER#${userId}` },
    UpdateExpression:
      'set score = if_not_exists(score, :start) + :scoreAddition',
    ExpressionAttributeValues: {
      ':scoreAddition': scoreAddition,
      ':start': 0,
    },
  };

  return dynamo.update(params).promise();
}

async function getQuestionCorpus(
  dynamo: DynamoDB.DocumentClient
): Promise<any | null> {
  const params = {
    TableName: TABLE_QUESTION,
    IndexName: 'QER_GSI',
    KeyConditionExpression: '#gsipk = :gsipk',
    ExpressionAttributeNames: {
      '#gsipk': 'gsi_pk',
    },
    ExpressionAttributeValues: {
      ':gsipk': 'Q',
    },
  };

  return dynamo.query(params).promise();
}
