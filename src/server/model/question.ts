import fs from 'fs';
import { AWSError, DynamoDB } from 'aws-sdk';
import { ScanOutput } from 'aws-sdk/clients/dynamodb';
import { format } from '@fast-csv/format';
import { ulid } from 'ulid';
import {
  MAX_PERCENT_TOO_CLOSE_ANSWERS_PER_GEN,
  PERCENTAGE_CONSIDERED_TOO_CLOSE,
  TABLE_QUESTION,
  TABLE_USER,
} from '../../config';
import { generateQuestionBundle, sliceIntoChunks } from '../../helpers';
import {
  DynamoQuestion,
  DynamoTip,
  ImportedQuestionSettings,
  RunStrategy,
} from './types';
import uploadCsvToS3 from '../io/uploadCsvToS3';
interface UserModelContext {
  dynamo: DynamoDB.DocumentClient;
}

export async function batchCreateQuestions(
  questions: ImportedQuestionSettings[],
  { dynamo }: UserModelContext
) {
  const chunks = sliceIntoChunks(questions, 24);
  const initialQuestionIds: string[] = [];
  const questionIds: string[] = [];

  const paramsForEachChunk = chunks.map((chunk) => ({
    RequestItems: {
      [TABLE_QUESTION]: chunk.map(
        ({
          question,
          fact,
          image,
          isInit,
          correctAnswer,
          timeLimit,
          unit,
          selectionPressure,
          tipsPerGeneration,
          initialTips,
          numTipsToShow,
        }: ImportedQuestionSettings) => {
          const id = ulid();

          if (isInit) {
            initialQuestionIds.push(`Q#${id}`);
          } else {
            questionIds.push(`Q#${id}`);
          }

          return {
            PutRequest: {
              Item: {
                id: `Q#${id}`,
                run: 0,
                settings: {
                  fact,
                  question,
                  image,
                  correctAnswer,
                  timeLimit,
                  unit,
                },
                strategy: {
                  selectionPressure,
                  tipsPerGeneration,
                  initialTips,
                  numTipsToShow,
                },
                isInit,
                qsk: `QDATA#${id}`,
                gsi_pk: `Q`,
                gsi_sk: `QDATA#${id}`,
              },
            },
          };
        }
      ),
    },
  }));

  // TODO: maybe do it in a trasnaction later, because it might happen, that it breaks and we do not know, where we stopped
  const allPromises = paramsForEachChunk.map((params) =>
    dynamo.batchWrite(params).promise()
  );

  const results = await Promise.all(allPromises);

  await updateUserBatches(initialQuestionIds, questionIds, { dynamo });

  return results;
}

export async function getQuestion(id: string, { dynamo }: UserModelContext) {
  const { Item } = await dynamo
    .get({
      TableName: TABLE_QUESTION,
      Key: { id, qsk: `QDATA#${id.split('#')[1]}` },
    })
    .promise();

  return Item as DynamoQuestion;
}

export async function getEnabledQuestionRuns(
  id: string,
  { dynamo }: UserModelContext
): Promise<any | null> {
  const params = {
    TableName: TABLE_QUESTION,
    KeyConditionExpression: '#id = :id and begins_with(#qsk, :qsk)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#qsk': 'qsk',
    },
    ExpressionAttributeValues: {
      ':id': id,
      ':qsk': `${id}#true`,
    },
  };

  const result = await dynamo.query(params).promise();

  return result.Items;
}

export async function createQuestionRun(
  id: string,
  { dynamo }: UserModelContext
) {
  const question = await getQuestion(id, { dynamo });

  const runId = question.run + 1;
  const runIndex = runId - 1;

  const params = {
    id: question.id,
    qsk: `${question.id}#true#R#${runId}`,
    gsi_pk: `${question.id}#true#R#${runId}`,
    gsi_sk: `${question.id}#R#${runId}`,
    generation: 1,
    previousTips:
      question.strategy.initialTips[
        runIndex % question.strategy.initialTips.length
      ],
    run: runId,
    settings: question.settings,
    strategy: {
      numTipsToShow:
        question.strategy.numTipsToShow[
          runIndex % question.strategy.numTipsToShow.length
        ],
      selectionPressure:
        question.strategy.selectionPressure[
          runIndex % question.strategy.selectionPressure.length
        ],
      tipsPerGeneration:
        question.strategy.tipsPerGeneration[
          runIndex % question.strategy.tipsPerGeneration.length
        ],
    },
  };

  await dynamo
    .put(
      {
        ReturnValues: 'ALL_OLD',
        TableName: TABLE_QUESTION,
        Item: params,
      },
      async (error) => {
        if (error) {
          console.error(error);
          return error;
        }

        await updateCurrentHighestRun(id, runId, { dynamo });
      }
    )
    .promise();

  return params;
}

export async function createQuestionTip(
  {
    tipId,
    id,
    tip,
    run,
    correctAnswer,
    strategy,
    generation,
    previousTips,
    timeLimit,
    knewAnswer,
    msElapsed,
    userId,
  }: {
    tipId: string;
    id: string;
    tip: number;
    run: number;
    correctAnswer: number;
    strategy: RunStrategy;
    generation: number;
    previousTips: number[];
    timeLimit?: number;
    knewAnswer: boolean;
    msElapsed: number;
    userId: string;
  },
  { dynamo }: UserModelContext
) {
  const currentTips = await getCurrentGenerationTips(id, run, generation, {
    dynamo,
  });

  const currentTipsWithAnswer = currentTips.filter(
    (t: DynamoTip) => !['undefined', 'null'].includes(typeof t.data.tip)
  );

  const params = {
    id,
    qsk: `T#${tipId}`,
    gsi_pk: `${id}#R#${run}#G#${generation}`,
    gsi_sk: `T#${tipId}`,
    run,
    generation,
    data: {
      tip,
      previousTips,
      msElapsed,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      correctAnswer,
      timeLimit,
      knewAnswer,
    },
  };

  // TODO: maybe consider mutex and/or transaction here
  return dynamo
    .put(
      {
        ReturnValues: 'ALL_OLD',
        TableName: TABLE_QUESTION,
        Item: params,
      },
      (error, { Attributes: newTip }) => {
        if (error) {
          console.error('Dynamo put operation failed: ', error);
        }

        // If we hit tips per generation threshold, start new generation by updating RUN
        if (currentTipsWithAnswer.length + 1 === strategy.tipsPerGeneration) {
          const allGenerationTips = [
            ...currentTipsWithAnswer.map((t: any) => t.data.tip),
            tip,
          ];
          // If we hit correct answer for too many people in generation, we disable this RUN
          if (
            isGenerationTooCloseToCorrectAnswer(
              allGenerationTips,
              correctAnswer
            )
          ) {
            return disableRun(id, run, { dynamo });
          }

          // new generation and new previous tips
          return updateCurrentGeneration(
            id,
            run,
            generation + 1,
            getNewPreviousTips(allGenerationTips, correctAnswer, strategy),
            { dynamo }
          );
        }
      }
    )
    .promise();
}

export async function getCurrentGenerationTips(
  questionId: string,
  runId: number,
  generationNumber: number,
  { dynamo }: UserModelContext
): Promise<any | null> {
  const params = {
    TableName: TABLE_QUESTION,
    IndexName: 'QER_GSI',
    KeyConditionExpression: '#gsipk = :gsipk and begins_with(#gsisk, :gsisk)',
    ExpressionAttributeNames: {
      '#gsipk': 'gsi_pk',
      '#gsisk': 'gsi_sk',
    },
    ExpressionAttributeValues: {
      ':gsisk': 'T#',
      ':gsipk': `${questionId}#R#${runId}#G#${generationNumber}`,
    },
  };

  const result = await dynamo.query(params).promise();

  return result.Items;
}

async function updateCurrentHighestRun(
  questionId: string,
  newRunId: number,
  { dynamo }: UserModelContext
): Promise<any> {
  const params = {
    TableName: TABLE_QUESTION,
    Key: { id: questionId, qsk: `QDATA#${questionId.split('#')[1]}` },
    UpdateExpression: 'set run = :newRunId',
    ExpressionAttributeValues: {
      ':newRunId': newRunId,
    },
  };

  return dynamo.update(params).promise();
}

export async function exportTipData({
  dynamo,
}: UserModelContext): Promise<string> {
  /*

  // OLD IMPLEMENTATION 

  let downloadUrl;

  const params = {
    TableName: TABLE_QUESTION,
    FilterExpression: 'begins_with(qsk, :qsk)',
    ExpressionAttributeValues: {
      ':qsk': 'T#',
    },
  };

  const headers = [
    'time',
    'date',
    'itemID',
    'participantID',
    'questionID',
    'runID',
    'generationID',
    'correct',
    'nparents',
    'parent1',
    'parent2',
    'parent3',
    'parent4',
    'parent5',
    'answered',
    'answertime',
    'limit',
    'tip',
  ];

  const returnValueOrEmptyString = (value: any) =>
    typeof value === 'undefined' ? '' : value;

  const stream = format({ headers });

  if (process.env.NODE_ENV !== 'production') {
    const writableStream = fs.createWriteStream(
      `export-tipdata-${Date.now()}.csv`
    );

    // @ts-ignore
    stream.pipe(writableStream);
  }

  const onScanTips = (err: AWSError, data: ScanOutput) => {
    if (err) {
      console.error('Unable to scan the table. Error:', JSON.stringify(err));
    } else {
      const items = (data as any).Items;

      if (items.length > 0) {
        items.forEach((row: DynamoTip) => {
          stream.write({
            time: new Date(Date.parse(row.data.createdAt))
              .toTimeString()
              .split('(')[0]
              .trim(),
            date: row.data.createdAt.substring(0, 10),
            itemID: row.qsk,
            participantID: row.data.createdBy,
            questionID: row.id,
            runID: row.run,
            generationID: row.generation,
            correct: row.data.correctAnswer,
            nparents: row.data.previousTips.length,
            parent1: returnValueOrEmptyString(row.data.previousTips[0]),
            parent2: returnValueOrEmptyString(row.data.previousTips[1]),
            parent3: returnValueOrEmptyString(row.data.previousTips[2]),
            parent4: returnValueOrEmptyString(row.data.previousTips[3]),
            parent5: returnValueOrEmptyString(row.data.previousTips[4]),
            answered: row.data.tip !== null ? 'true' : 'false',
            answertime: row.data.msElapsed,
            limit:
              typeof row.data.timeLimit === 'undefined'
                ? 'false'
                : row.data.timeLimit * 1000,
            tip: row.data.tip,
          });
        });
      }

      if (typeof data.LastEvaluatedKey !== 'undefined') {
        dynamo.scan(
          { ...params, ExclusiveStartKey: data.LastEvaluatedKey },
          onScanTips
        );
      } else {
        if (process.env.NODE_ENV === 'production') {
          downloadUrl = uploadCsvToS3(stream, `export-tipdata-${Date.now()}`);
        } else {
          downloadUrl = 'local';
        }

        stream.end();
      }
    }
  };

  await dynamo.scan(params, onScanTips).promise();

  */

  let downloadUrl;

  const baseParams = {
    TableName: TABLE_QUESTION,
    FilterExpression: 'begins_with(qsk, :qsk)',
    ExpressionAttributeValues: {
      ':qsk': 'T#',
    },
  };

  const headers = [
    'time',
    'date',
    'itemID',
    'participantID',
    'questionID',
    'runID',
    'generationID',
    'correct',
    'nparents',
    'parent1',
    'parent2',
    'parent3',
    'parent4',
    'parent5',
    'answered',
    'answertime',
    'limit',
    'tip',
  ];

  const returnValueOrEmptyString = (value: any) =>
    typeof value === 'undefined' ? '' : value;

  const stream = format({ headers });

  if (process.env.NODE_ENV !== 'production') {
    const writableStream = fs.createWriteStream(
      `export-tipdata-${Date.now()}.csv`
    );

    // @ts-ignore
    stream.pipe(writableStream);
  }

  const writeTipsToStream = (tipsArray, anyWritableStream) => {
    if (tipsArray.length > 0) {
      tipsArray.forEach((row: DynamoTip) => {
        anyWritableStream.write({
          time: new Date(Date.parse(row.data.createdAt))
            .toTimeString()
            .split('(')[0]
            .trim(),
          date: row.data.createdAt.substring(0, 10),
          itemID: row.qsk,
          participantID: row.data.createdBy,
          questionID: row.id,
          runID: row.run,
          generationID: row.generation,
          correct: row.data.correctAnswer,
          nparents: row.data.previousTips.length,
          parent1: returnValueOrEmptyString(row.data.previousTips[0]),
          parent2: returnValueOrEmptyString(row.data.previousTips[1]),
          parent3: returnValueOrEmptyString(row.data.previousTips[2]),
          parent4: returnValueOrEmptyString(row.data.previousTips[3]),
          parent5: returnValueOrEmptyString(row.data.previousTips[4]),
          answered: row.data.tip !== null ? 'true' : 'false',
          answertime: row.data.msElapsed,
          limit:
            typeof row.data.timeLimit === 'undefined'
              ? 'false'
              : row.data.timeLimit * 1000,
          tip: row.data.tip,
        });
      });
    }
  };

  let data = await dynamo.scan(baseParams).promise();

  writeTipsToStream(data.Items, stream);

  // scan recursively
  while (typeof data.LastEvaluatedKey !== 'undefined') {
    const params = {
      ...baseParams,
      ExclusiveStartKey: data.LastEvaluatedKey,
    };
    data = await dynamo.scan(params).promise();

    writeTipsToStream(data.Items, stream);
  }

  if (process.env.NODE_ENV === 'production') {
    downloadUrl = uploadCsvToS3(stream, `export-tipdata-${Date.now()}`);
  } else {
    downloadUrl = 'local';
  }

  stream.end();

  return downloadUrl;
}

async function updateCurrentGeneration(
  questionId: string,
  runId: string | number,
  newCurrentGeneration: number,
  newPreviousTips: number[],
  { dynamo }: UserModelContext
): Promise<any> {
  const params = {
    TableName: TABLE_QUESTION,
    Key: { id: questionId, qsk: `${questionId}#true#R#${runId}` },
    UpdateExpression:
      'set generation = :newCurrentGeneration, previousTips = :previousTips',
    ExpressionAttributeValues: {
      ':newCurrentGeneration': newCurrentGeneration,
      ':previousTips': newPreviousTips,
    },
  };

  return dynamo.update(params).promise();
}

async function updateUserBatches(
  initialQuestionIds: string[],
  questionIds: string[],
  { dynamo }: UserModelContext
): Promise<any> {
  const params = {
    TableName: TABLE_USER,
    FilterExpression: '#role <> :adminrole',
    ExpressionAttributeNames: { '#role': 'role' },
    ExpressionAttributeValues: {
      ':adminrole': 'admin',
    },
  };

  // get last item of both sets of question ids, just to check whether the user already has it
  const [lastQuestionAdded] = [...initialQuestionIds, ...questionIds].slice(-1);
  let users: string[] = [];

  const onScanUsersAndUpdateBundles = async (
    err: AWSError,
    data: ScanOutput
  ): Promise<void> => {
    if (err) {
      console.error('Unable to scan the table. Error:', JSON.stringify(err));
    } else {
      const additionalUsers = (data as any).Items.filter(
        ({ bundle }: { bundle: string[] }) =>
          !bundle.includes(lastQuestionAdded)
      );

      if (additionalUsers.length > 0) {
        const chunks = sliceIntoChunks(additionalUsers, 24);

        const paramsForEachChunk = chunks.map((chunk) =>
          chunk.map(({ id, bundle }) => ({
            Update: {
              TableName: TABLE_USER,
              Key: { id, userskey: `USER#${id}` },
              UpdateExpression: 'set bundle = :bundle',
              ExpressionAttributeValues: {
                ':bundle': [
                  ...bundle,
                  ...generateQuestionBundle(initialQuestionIds, questionIds),
                ],
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

async function disableRun(
  questionId: string,
  runId: string | number,
  { dynamo }: UserModelContext
): Promise<any> {
  const paramsDelete = {
    TableName: TABLE_QUESTION,
    Key: { id: questionId, qsk: `${questionId}#true#R#${runId}` },
    ReturnValues: 'ALL_OLD',
  };

  return dynamo
    .delete(paramsDelete, (error, data) => {
      if (error) {
        console.error('Dynamo delete operation failed: ', error);
      }

      if (data.Attributes) {
        const { Attributes } = data;
        const paramsInsert = {
          TableName: TABLE_QUESTION,
          Item: {
            ...Attributes,
            qsk: Attributes!.qsk.replace('true', 'false'),
            gsi_pk: Attributes!.qsk.replace('true', 'false'),
          },
        };

        return dynamo
          .put(paramsInsert, (err) => {
            if (err) {
              console.error('Dynamo reInsert operation failed: ', err);
            }
          })
          .promise();
      }
    })
    .promise();
}

function getNewPreviousTips(
  tips: number[],
  correctAnswer: number,
  { selectionPressure }: RunStrategy
): number[] {
  // TODO: do we want to use Math.floor? How do we make sure, we never create FLOAT? This is probably not app's job
  // TODO: apply numTipsToShow if it differs from how many we have after applying selection
  const numTipsToRemove = Math.floor(selectionPressure * tips.length);
  return tips
    .sort((a, b) => Math.abs(correctAnswer - a) - Math.abs(correctAnswer - b))
    .slice(0, numTipsToRemove >= 1 ? -numTipsToRemove : tips.length)
    .sort(() => Math.random() - 0.5);
}

// TODO: get rid of this ANY
function isGenerationTooCloseToCorrectAnswer(
  tips: number[],
  correctAnswer: number
): boolean {
  // Fraction of correct answer which is considered to be too close
  const fraction = (correctAnswer * PERCENTAGE_CONSIDERED_TOO_CLOSE) / 100;

  return (
    (tips.length * MAX_PERCENT_TOO_CLOSE_ANSWERS_PER_GEN) / 100 <=
    tips.reduce((count: number, t: number) => {
      if (Math.abs(correctAnswer - t) <= fraction) {
        return count + 1;
      }
      return count;
    }, 0)
  );
}
