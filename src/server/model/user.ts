import { AWSError, DynamoDB } from 'aws-sdk';
import { ScanOutput } from 'aws-sdk/clients/dynamodb';
import { SupabaseClient } from '@supabase/supabase-js';
import { ulid } from 'ulid';
import * as yup from 'yup';
import {
  TABLE_USER,
  USERS_BY_EMAIL_INDEX,
  PLAYERS_BY_HIGHSCORE,
} from '../../config';
import { generateQuestionBundle, sliceIntoChunks } from '../../helpers';
import { getUniqueSlug } from '../io';
import {
  ModelContext,
  ProgressItem,
  User,
  UserRole,
  UserSettings,
} from './types';
import { getQuestionCorpusV2 } from './question';

interface UserModelContext {
  dynamo: DynamoDB.DocumentClient;
}

function generateIpipBundle(supabase: SupabaseClient) {
  return [];
}

export async function createUser(
  args: {
    email: string;
    password: string;
    role: UserRole;
    language: string;
    country: string;
  },
  { dynamo, supabase }: ModelContext
) {
  const id = ulid();

  const questions = await getQuestionCorpusV2(supabase);
  const currentIndex = await getCurrentUserIndex(dynamo);

  const initialQuestions = questions
    .filter((q: any) => q.isInit)
    .map((q: any) => q.id);
  const restQuestions = questions
    .filter((q: any) => !q.isInit)
    .map((q: any) => q.id);
  const bundle = generateQuestionBundle(initialQuestions, restQuestions);
  const ipipBundle = generateIpipBundle(supabase);

  const user: User = {
    bundle,
    ipipBundle,
    createdAt: new Date().toISOString(),
    email: args.email,
    id,
    language: args.language,
    country: args.country,
    lastQuestion: null,
    lastIpipQuestion: null,
    userskey: `USER#${id}`,
    password: args.password,
    role: args.role,
    slug: '',
    updatedAt: new Date().toISOString(),
    score: 0,
  };

  // check if user does not exist
  const foundUser = await findUserByEmail(user.email, { dynamo });

  if (foundUser) {
    throw new yup.ValidationError('This email already exists', null, 'email');
  }

  await executeTransactWriteUser(user, currentIndex, dynamo);

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

export async function batchSlugifyUsers({
  dynamo,
}: UserModelContext): Promise<any> {
  const currentDbIndex = await getCurrentUserIndex(dynamo);
  let currentIndex = currentDbIndex;

  const params = {
    TableName: TABLE_USER,
    FilterExpression: 'begins_with(#userskey, :userskey)',
    ExpressionAttributeNames: { '#userskey': 'userskey' },
    ExpressionAttributeValues: {
      ':userskey': 'USER#',
    },
  };

  let users: string[] = [];

  const onScanUsersAndUpdateBundles = async (
    err: AWSError,
    data: ScanOutput
  ): Promise<void> => {
    if (err) {
      console.error('Unable to scan the table. Error:', JSON.stringify(err));
    } else {
      const additionalUsers = (data as any).Items;

      if (additionalUsers.length > 0) {
        const chunks = sliceIntoChunks(additionalUsers, 24);

        const paramsForEachChunk = chunks.map((chunk, chunkIndex) =>
          chunk.map(({ id }, userInChunkIndex) => ({
            Update: {
              TableName: TABLE_USER,
              Key: { id, userskey: `USER#${id}` },
              UpdateExpression: 'set slug = :slug',
              ExpressionAttributeValues: {
                ':slug': getUniqueSlug(
                  currentIndex + chunkIndex * 24 + userInChunkIndex + 1
                ),
              },
            },
          }))
        );

        const allPromises = paramsForEachChunk.map((paramsForChunk) =>
          dynamo
            .transactWrite({
              TransactItems: paramsForChunk,
            })
            .promise()
        );

        await Promise.all(allPromises);
      }

      users = [...users, ...additionalUsers];
      currentIndex = currentIndex + users.length;

      if (typeof data.LastEvaluatedKey !== 'undefined') {
        dynamo.scan(
          { ...params, ExclusiveStartKey: data.LastEvaluatedKey },
          onScanUsersAndUpdateBundles
        );
      } else {
        await dynamo
          .update({
            TableName: TABLE_USER,
            Key: { id: 'METADATA', userskey: 'METADATA' },
            UpdateExpression: 'SET currentIndex = :cindex',
            ExpressionAttributeValues: {
              ':cindex': currentIndex,
            },
          })
          .promise();
      }
    }
  };

  dynamo.scan(params, onScanUsersAndUpdateBundles);
}

async function getCurrentUserIndex(dynamo: DynamoDB.DocumentClient) {
  const { Item } = await dynamo
    .get({
      TableName: TABLE_USER,
      Key: { id: 'METADATA', userskey: 'METADATA' },
    })
    .promise();

  if (!Item) {
    const paramsInsert = {
      TableName: TABLE_USER,
      Item: {
        currentIndex: 0,
        id: 'METADATA',
        userskey: 'METADATA',
      },
    };
    await dynamo
      .put(paramsInsert, (err) => {
        if (err) {
          console.error(
            'Dynamo create METADATA currentIndex operation failed: ',
            err
          );
        }
      })
      .promise();
  }

  return Item?.currentIndex || 0;
}

export async function executeTransactWriteUser(
  user: User,
  index,
  dynamo: DynamoDB.DocumentClient
): Promise<DynamoDB.DocumentClient.TransactWriteItemsOutput> {
  let currentIndex = index;
  const getMetaData = (current: number) => ({
    Update: {
      TableName: TABLE_USER,
      Key: { id: 'METADATA', userskey: 'METADATA' },
      ConditionExpression: 'currentIndex = :currindex',
      UpdateExpression: 'SET currentIndex = currentIndex + :incr',
      ExpressionAttributeValues: {
        ':incr': 1,
        ':currindex': currentIndex,
      },
    },
  });
  const transactionRequest = dynamo.transactWrite({
    TransactItems: [
      // increment counter
      getMetaData(currentIndex),
      // write user
      {
        Put: {
          TableName: TABLE_USER,
          Item: { ...user, slug: getUniqueSlug(currentIndex + 1) },
        },
      },
    ],
  });
  let cancellationReasons: any[];
  transactionRequest.on('extractError', (response) => {
    try {
      cancellationReasons = JSON.parse(
        response.httpResponse.body.toString()
      ).CancellationReasons;
    } catch (err) {
      // suppress this just in case some types of errors aren't JSON parseable
      console.error('Error extracting cancellation error', err);
    }
  });
  return new Promise((resolve, reject) => {
    transactionRequest.send((err, response) => {
      if (err) {
        console.error('Error performing transactWrite', {
          cancellationReasons,
          err,
        });

        if (
          cancellationReasons.filter(
            (reason) => reason.Code === 'ConditionalCheckFailed'
          ).length > 0
        ) {
          return executeTransactWriteUser(user, index + 1, dynamo);
        }

        return reject(err);
      }
      return resolve(response);
    });
  });
}

export async function wipeAllBatches({ dynamo }: UserModelContext) {
  const params = {
    TableName: TABLE_USER,
    FilterExpression:
      'begins_with(#userskey, :userskey) and #role <> :adminrole',
    ExpressionAttributeNames: { '#role': 'role', '#userskey': 'userskey' },
    ExpressionAttributeValues: {
      ':userskey': 'USER#',
      ':adminrole': 'admin',
    },
  };

  let users: string[] = [];

  const onScanUsersAndUpdateBundles = async (
    err: AWSError,
    data: ScanOutput
  ): Promise<void> => {
    if (err) {
      console.error('Unable to scan the table. Error:', JSON.stringify(err));
    } else {
      const additionalUsers = (data as any).Items.filter(
        ({ bundle }: { bundle: string[] }) => bundle.length > 0
      );

      if (additionalUsers.length > 0) {
        const chunks = sliceIntoChunks(additionalUsers, 24);

        const paramsForEachChunk = chunks.map((chunk) =>
          chunk.map(({ id }) => ({
            Update: {
              TableName: TABLE_USER,
              Key: { id, userskey: `USER#${id}` },
              UpdateExpression: 'set bundle = :bundle',
              ExpressionAttributeValues: {
                ':bundle': [],
              },
            },
          }))
        );

        const allPromises = paramsForEachChunk.map((paramsForChunk) =>
          dynamo
            .transactWrite({
              TransactItems: paramsForChunk,
            })
            .promise()
        );

        await Promise.all(allPromises);
      }

      users = [...users, ...additionalUsers];

      if (typeof data.LastEvaluatedKey !== 'undefined') {
        dynamo.scan(
          { ...params, ExclusiveStartKey: data.LastEvaluatedKey },
          onScanUsersAndUpdateBundles
        );
      }
    }
  };

  dynamo.scan(params, onScanUsersAndUpdateBundles);
}
