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
import { getQuestionCorpus } from './question';

async function generateIpipBundle(supabase: SupabaseClient): Promise<number[]> {
  const { data } = await supabase.from('ipip_questionnaire').select('id');

  return generateQuestionBundle(
    [],
    data.map((item) => item.id)
  );
}

export async function createUser(
  args: {
    email: string;
    password: string;
    role: UserRole;
    language: string;
    country: string;
  },
  context: ModelContext
) {
  const { dynamo, supabase } = context;
  const id = ulid();

  const questions = await getQuestionCorpus(supabase);
  const currentIndex = await getCurrentUserIndex(dynamo);

  const initialQuestions = questions
    .filter((q: any) => q.isInit)
    .map((q: any) => q.id);
  const restQuestions = questions
    .filter((q: any) => !q.isInit)
    .map((q: any) => q.id);
  const bundle = generateQuestionBundle(initialQuestions, restQuestions);
  const ipipBundle = await generateIpipBundle(supabase);

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
  const foundUser = await findUserByEmail(user.email, context);

  if (foundUser) {
    throw new yup.ValidationError('This email already exists', null, 'email');
  }

  await executeTransactWriteUser(user, currentIndex, dynamo);

  return user;
}

export async function findUserById(
  id: string,
  { dynamo }: ModelContext
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
  { dynamo }: ModelContext
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
  { dynamo }: ModelContext
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
  { dynamo }: ModelContext
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
  { dynamo }: ModelContext
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

export async function updateLastIpipQuestion(
  userId: string,
  newLastIpipQuestion: number,
  { dynamo }: ModelContext
): Promise<any> {
  const params = {
    TableName: TABLE_USER,
    Key: { id: userId, userskey: `USER#${userId}` },
    UpdateExpression: 'set lastIpipQuestion = :newLastIpipQuestion',
    ExpressionAttributeValues: {
      ':newLastIpipQuestion': newLastIpipQuestion,
    },
  };

  return dynamo.update(params).promise();
}

export async function updateScore(
  userId: string,
  scoreAddition: number,
  { tipId, questionId }: ProgressItem,
  { dynamo }: ModelContext
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
}: ModelContext): Promise<any> {
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

export async function wipeAllBatches({ dynamo, supabase }: ModelContext) {
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

  const { data: ipipData } = await supabase
    .from('ipip_questionnaire')
    .select('id');

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

        const paramsForEachChunk = chunks.map((chunk) =>
          chunk.map(({ id }) => ({
            Update: {
              TableName: TABLE_USER,
              Key: { id, userskey: `USER#${id}` },
              UpdateExpression:
                'set bundle = :bundle, lastQuestion = :lastQuestion, ipipBundle = :ipipBundle, lastIpipQuestion = :lastIpipQuestion, score = :score',
              ExpressionAttributeValues: {
                ':score': 0,
                ':bundle': [],
                ':lastQuestion': null,
                ':ipipBundle': generateQuestionBundle(
                  [],
                  ipipData.map((item) => item.id)
                ),
                ':lastIpipQuestion': null,
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

export async function invalidatePasswordResetRequests(
  userId: string,
  context: ModelContext
): Promise<boolean> {
  const { sql } = context;

  await sql`
    UPDATE 
      password_reset_request
      set revoked_at = now()
    WHERE user_id = ${userId}
      and used_at IS NULL
      and revoked_at IS NULL
      and expires_at > now()`;

  return true;
}

type PasswordResetRequestParams = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ip: string;
  userAgent?: string;
};

export async function createPasswordResetRequest(
  {
    id,
    userId,
    tokenHash,
    expiresAt,
    ip,
    userAgent,
  }: PasswordResetRequestParams,
  { sql }: ModelContext
): Promise<boolean> {
  const now = new Date();

  await sql`
    INSERT into password_reset_request (id, user_id, token_hash, created_at, expires_at, request_ip, user_agent)
    values (${id}, ${userId}, ${tokenHash}, ${now}, ${expiresAt}, ${ip}, ${
    userAgent ?? null
  })
  `;

  return true;
}

export async function getPasswordResetRequest(id, { sql }: ModelContext) {
  return sql`
    SELECT id, user_id, token_hash, expires_at, used_at, revoked_at
    FROM password_reset_request
    WHERE id = ${id}
    LIMIT 1
  `.then((r) => r[0]);
}

export async function isOverLimitPasswordResets(
  userId: string,
  { sql }: ModelContext
) {
  const [r] = await sql`
    WITH last_24h AS (
      SELECT
        COUNT(*)::int as cnt_24h,
        MAX(created_at) as last_created_at,
        BOOL_OR(used_at IS NULL AND revoked_at IS NULL AND expires_at > now()) as has_active
      FROM password_reset_request
      WHERE user_id = ${userId}
        AND created_at > now() - interval '24 hours'
    )
    SELECT
      cnt_24h,
      has_active,
      last_created_at,
      (last_created_at + interval '24 hours') as next_allowed_at
    FROM last_24h
  `;
  return r?.cnt24h >= 2 && r?.hasActive;
}

export async function resetUserPassword(
  userId,
  requestId,
  password,
  { dynamo, sql }
) {
  const params = {
    TableName: TABLE_USER,
    Key: { id: userId, userskey: `USER#${userId}` },
    UpdateExpression: 'set password = :password',
    ExpressionAttributeValues: {
      ':password': password,
    },
  };

  await dynamo.update(params).promise();

  await sql.begin(async (tx) => {
    await tx`UPDATE password_reset_request SET used_at = now() WHERE id = ${requestId}`;
    await tx`
      UPDATE password_reset_request
      SET revoked_at = now()
      WHERE user_id = ${userId}
        AND id <> ${requestId}
        AND used_at IS NULL
        AND revoked_at IS NULL
        AND expires_at > now()
    `;
  });
}
