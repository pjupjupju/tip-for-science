import { DynamoDB } from 'aws-sdk';
import { ulid } from 'ulid';
import * as yup from 'yup';
import {
  TABLE_USER,
  TABLE_QUESTION,
  USERS_BY_EMAIL_INDEX,
  PLAYERS_BY_HIGHSCORE,
} from '../../config';
import { generateQuestionBundle } from '../../helpers';
import { ProgressItem, User, UserRole, UserSettings } from './types';

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

  const questions = await getQuestionCorpus(dynamo);

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
    password: args.password,
    role: args.role,
    slug: Date.now().toString(), // use timestamp converted to string for now
    updatedAt: new Date().toISOString(),
    score: 0,
  };

  // check if user does not exist
  const foundUser = await findUserByEmail(user.email, { dynamo });

  if (foundUser) {
    throw new yup.ValidationError('Tento email už existuje', null, 'email');
  }

  await dynamo
    .transactWrite({
      TransactItems: (
        [
          // write user
          {
            Put: {
              TableName: TABLE_USER,
              Item: user,
            },
          },
        ] as (DynamoDB.DocumentClient.TransactWriteItem | undefined)[]
      ).filter(Boolean) as DynamoDB.DocumentClient.TransactWriteItem[],
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

export async function updateUserSettings(
  userId: string,
  settings: UserSettings,
  { dynamo }: UserModelContext
): Promise<any> {
  if (Object.keys(settings).length === 0) {
    return new Promise(null);
  }

  const changeSet = Object.entries(settings).reduce(
    (
      acc: {
        expression: string;
        values: { [k: string]: string };
        names: { [k: string]: string };
      },
      property: [string, string | number],
      index,
      arr
    ) => {
      const key = `${property[0]}`;
      return {
        expression: `${acc.expression} #${key} = :${key}${
          arr.length !== 1 && index + 1 !== arr.length ? ', ' : ''
        }`,
        values: {
          ...acc.values,
          [`:${key}`]: property[1],
        },
        names: {
          ...acc.names,
          [`#${key}`]: key,
        },
      };
    },
    { values: {}, names: {}, expression: 'set ' }
  );

  const params = {
    TableName: TABLE_USER,
    Key: { id: userId, userskey: `USER#${userId}` },
    UpdateExpression: changeSet.expression,
    ExpressionAttributeValues: {
      ...changeSet.values,
    },
    ExpressionAttributeNames: {
      ...changeSet.names,
    },
  };

  return dynamo.update(params).promise();
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
  { tipId, questionId }: ProgressItem,
  { dynamo }: UserModelContext
): Promise<any> {
  const updateAndInsertParams = [
    {
      Update: {
        TableName: TABLE_USER,
        Key: { id: userId, userskey: `USER#${userId}` },
        UpdateExpression:
          'set score = if_not_exists(score, :start) + :scoreAddition',
        ExpressionAttributeValues: {
          ':scoreAddition': scoreAddition,
          ':start': 0,
        },
      },
    },
    {
      Put: {
        TableName: TABLE_USER,
        Item: {
          id: userId,
          qId: questionId,
          userskey: `T#${tipId}`,
          score: scoreAddition,
          createdAt: new Date().toISOString(),
        },
      },
    },
  ];

  return dynamo
    .transactWrite({
      TransactItems: updateAndInsertParams,
    })
    .promise();
}

export async function getHighScorePlayers(
  dynamo: DynamoDB.DocumentClient
): Promise<any | null> {
  const params = {
    TableName: TABLE_USER,
    IndexName: PLAYERS_BY_HIGHSCORE,
    KeyConditionExpression: '#role = :role',
    ExpressionAttributeNames: {
      '#role': 'role',
    },
    ExpressionAttributeValues: {
      ':role': 'player',
    },
    ScanIndexForward: false,
    Limit: 10,
  };

  const result = await dynamo.query(params).promise();

  return result.Items;
}

export async function getUserProgress(
  id: string,
  dynamo: DynamoDB.DocumentClient
): Promise<any | null> {
  const params = {
    TableName: TABLE_USER,
    KeyConditionExpression: '#id = :id and begins_with(#userskey, :userskey)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#userskey': 'userskey',
    },
    ExpressionAttributeValues: {
      ':id': id,
      ':userskey': `T`,
    },
  };

  const result = await dynamo.query(params).promise();

  return result.Items;
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

  const result = await dynamo.query(params).promise();

  return result.Items;
}
