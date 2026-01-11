import fs from 'fs';
import { AWSError, DynamoDB } from 'aws-sdk';
import { ScanOutput } from 'aws-sdk/clients/dynamodb';
import { format } from '@fast-csv/format';
import decamelizeKeys from 'decamelize-keys';
import toCamelCase from 'camelcase-keys';
import { ulid } from 'ulid';
import {
  INITIAL_GENERATION_NUMBER,
  MAX_GENERATION_NUMBER,
  MAX_PERCENT_TOO_CLOSE_ANSWERS_PER_GEN,
  PERCENTAGE_CONSIDERED_TOO_CLOSE,
  TABLE_QUESTION,
  TABLE_USER,
} from '../../config';
import { generateQuestionBundle, sliceIntoChunks } from '../../helpers';
import {
  DynamoQuestion,
  DynamoRun,
  DynamoTip,
  ImportedQuestionSettings,
  ModelContext,
  PostgresQuestion,
  PostgresQuestionWithRun,
  PostgresTip,
  RunStrategy,
} from './types';
import { uploadCsvToS3, RunLock } from '../io';
import { getInitialTips, getRunConfig } from '../io/utils';

export async function batchCreateQuestions(
  questions: ImportedQuestionSettings[],
  context: ModelContext
) {
  const { dynamo } = context;

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
                  selectionPressure: [],
                  tipsPerGeneration: [],
                  initialTips: [],
                  numTipsToShow: [],
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

  await updateUserBatches(initialQuestionIds, questionIds, context);

  return results;
}

export async function getAllQuestions({ dynamo }: ModelContext) {
  const params = {
    TableName: TABLE_QUESTION,
    KeyConditionExpression: 'begins_with(#id, :id) and begins_with(#qsk, :qsk)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#qsk': 'qsk',
    },
    ExpressionAttributeValues: {
      ':id': 'Q#',
      ':qsk': 'QDATA#',
    },
  };

  const result = await dynamo.query(params).promise();

  return result.Items;
}

export async function getQuestion(id: string, { dynamo }: ModelContext) {
  const { Item } = await dynamo
    .get({
      TableName: TABLE_QUESTION,
      Key: { id, qsk: `QDATA#${id.split('#')[1]}` },
    })
    .promise();

  return Item as DynamoQuestion;
}

export async function getQuestionRun(
  id: string,
  run: number,
  { dynamo }: ModelContext
) {
  const { Item } = await dynamo
    .get({
      TableName: TABLE_QUESTION,
      Key: { id, qsk: `${id}#true#R#${run}` },
    })
    .promise();

  return Item as DynamoRun;
}

export async function getEnabledQuestionRuns(
  id: string,
  { dynamo }: ModelContext
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

export async function createQuestionRun(id: string, context: ModelContext) {
  const { dynamo } = context;
  const question = await getQuestion(id, context);

  const runId = question.run + 1;
  const runIndex = runId - 1;

  const params = {
    id: question.id,
    qsk: `${question.id}#true#R#${runId}`,
    gsi_pk: `${question.id}#true#R#${runId}`,
    gsi_sk: `${question.id}#R#${runId}`,
    generation: INITIAL_GENERATION_NUMBER,
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

  // TODO: add transaction Put and Update!
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

        await updateCurrentHighestRun(id, runId, context);
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
    answered,
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
    answered: boolean;
    msElapsed: number;
    userId: string;
  },
  context: ModelContext & { runLock: RunLock }
) {
  const { dynamo, runLock } = context;
  const currentTips = await getCurrentGenerationTips(
    id,
    run,
    generation,
    context
  );

  const currentTipsWithAnswer = currentTips.filter(
    (t: DynamoTip) =>
      !['undefined', 'null'].includes(typeof t.data.tip) &&
      t.data.answered !== false &&
      t.data.knewAnswer !== true
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
      answered,
    },
  };

  // TODO: maybe consider mutex and/or transaction here
  return dynamo
    .put({
      ReturnValues: 'ALL_OLD',
      TableName: TABLE_QUESTION,
      Item: params,
    })
    .promise()
    .then(() => {
      // If we hit tips per generation threshold, start new generation by updating RUN
      if (
        answered !== false &&
        knewAnswer !== true &&
        currentTipsWithAnswer.length + 1 >= strategy.tipsPerGeneration &&
        !runLock.getLock(`${id}#${run}#${generation}`)
      ) {
        // We first check, whether RUN is still enabled and whether generation is still the same
        getQuestionRun(id, run, context).then((dbRun) => {
          if (dbRun && dbRun.generation === generation) {
            // Lock current Q#RUN#GEN to prevent creating multiple generations
            // we release current generation when we create next generation in future
            runLock.lock(`${id}#${run}#${generation}`);

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
              return disableRun(id, run, context);
            }

            // new generation and new previous tips
            return updateCurrentGeneration(
              id,
              run,
              generation + 1,
              getNewPreviousTips(allGenerationTips, correctAnswer, strategy),
              context
            );
          }
        });
      }
    })
    .catch((error) => {
      if (error) {
        console.error('Dynamo put operation failed: ', error);
      }
    });
}

export async function getCurrentGenerationTips(
  questionId: string,
  runId: number,
  generationNumber: number,
  { dynamo }: ModelContext
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
  { dynamo }: ModelContext
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

export async function exportTipData({ dynamo }: ModelContext): Promise<string> {
  let downloadUrl: Promise<string> | string;

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
    'knewAnswer',
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
          answered: returnValueOrEmptyString(row.data.answered).toString(),
          knewAnswer: returnValueOrEmptyString(row.data.knewAnswer).toString(),
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
  { dynamo, runLock }: ModelContext & { runLock: RunLock }
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

  try {
    await dynamo.update(params).promise();
  } catch (e) {
    console.error('Update DynamoDB generation failed: ', e);
  } finally {
    if (newCurrentGeneration - 2 >= INITIAL_GENERATION_NUMBER) {
      runLock.unlock(`${questionId}#${runId}#${newCurrentGeneration - 2}`);
    }
  }
}

async function updateUserBatches(
  initialQuestionIds: string[],
  questionIds: string[],
  { dynamo }: ModelContext
): Promise<any> {
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
  { dynamo }: ModelContext
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

// --------------------- POSTGRES ----------------------------

export async function batchCreateQuestionsV2(
  questions: ImportedQuestionSettings[],
  context: ModelContext
) {
  const { supabase } = context;
  const chunks = sliceIntoChunks(questions, 24);
  const initialQuestionIds: string[] = [];
  const questionIds: string[] = [];
  const now = new Date();

  const paramsForEachChunk = chunks.map((chunk) =>
    chunk.map(
      ({
        question,
        fact,
        image,
        isInit,
        correctAnswer,
        timeLimit,
        unit,
        qIdInSheet,
      }: ImportedQuestionSettings) => {
        const id = ulid();

        if (isInit) {
          initialQuestionIds.push(id);
        } else {
          questionIds.push(id);
        }

        return decamelizeKeys({
          id,
          createdAt: now,
          enabled: true,
          settings: {
            fact,
            question,
            image,
            correctAnswer,
            timeLimit,
            unit,
          },
          strategy: {},
          isInit,
          updatedAt: now,
          idInSheet: qIdInSheet,
        });
      }
    )
  );

  // TODO: maybe do it in a trasnaction later, because it might happen, that it breaks and we do not know, where we stopped
  const allPromises = paramsForEachChunk.map((params) =>
    supabase.from('question').insert(params)
  );

  const results = await Promise.all(allPromises);
  await updateUserBatches(initialQuestionIds, questionIds, context);

  return results;
}

export async function getNotImportedQuestions(
  questions: ImportedQuestionSettings[],
  { sql }: ModelContext
) {
  const idsInSheet = questions.map((q) => q.qIdInSheet);
  const result = await sql`
  SELECT q.id_in_sheet
    FROM "question" q
    WHERE q.id_in_sheet = any(${sql.array([...idsInSheet]).value});
  `;

  const importedSheetIds = (result || []).map((row) => row.idInSheet);

  return questions.filter((q) => !importedSheetIds.includes(q.qIdInSheet));
}

export async function getEnabledQuestionRunsV2(
  id: string,
  { sql }: ModelContext
): Promise<any | null> {
  try {
    const result = await sql`
      SELECT r.*, r.strategy::json AS strategyk, q.settings::json AS settings
      FROM "run" r
      LEFT JOIN "question" q ON r.question_id = q.id
      WHERE r.question_id = ${id} AND r.enabled = true
    `;

    return result;
  } catch (e) {
    console.log(e);

    return [];
  }
}

export async function getQuestionCorpusV2(supabase: ModelContext['supabase']) {
  const { data } = await supabase.from('question').select();

  return data.map(item => toCamelCase(item));
}

export async function getQuestionV2(id: string, { supabase }: ModelContext) {
  const {
    data: [question],
  } = await supabase.from('question').select().eq('id', id);

  return question;
}

export async function getQuestionRunV2(id: string, { supabase }: ModelContext) {
  const {
    data: [run],
  } = await supabase.from('run').select().eq('id', id);

  return run;
}

export async function getQuestionWithRun(
  id: string,
  rId: number,
  { sql }: ModelContext
): Promise<PostgresQuestionWithRun> {
  const questions = await sql`
    SELECT 
      q.id,
      q.settings,
      q.enabled,
      q.is_init,
      r.strategy as strategy,
      r.id as run_id
    FROM "question" q
    INNER JOIN "run" r ON q.id = r.question_id
    WHERE q.id = ${id} AND r.run_num = ${rId}
  `;

  return questions[0] as PostgresQuestionWithRun;
}

export async function getQuestionWithHighestRun(
  id: string,
  { sql }: ModelContext
): Promise<PostgresQuestion> {
  const questions = await sql`
    SELECT 
      q.*,
      COALESCE(r.run_num, 0)::integer as run
    FROM "question" q
    LEFT JOIN LATERAL (
      SELECT *
      FROM "run"
      WHERE question_id = q.id
      ORDER BY run_num DESC
      LIMIT 1
    ) r ON true
    WHERE q.id = ${id}
  `;

  return questions[0] as PostgresQuestion;
}

function getNewPreviousTipsV2(
  tips: number[],
  correctAnswer: number,
  { selectionPressure }: RunStrategy
): number[] {
  const numTipsToRemove = Math.floor(selectionPressure * tips.length);
  return tips
    .sort((a, b) => Math.abs(correctAnswer - a) - Math.abs(correctAnswer - b))
    .slice(0, numTipsToRemove >= 1 ? -numTipsToRemove : tips.length)
    .sort(() => Math.random() - 0.5);
}

export async function createQuestionRunV2(
  questionId: string,
  context: ModelContext
) {
  const { sql } = context;
  const question = await getQuestionWithHighestRun(questionId, context);

  const runNum = question?.run + 1;

  const id = ulid();

  const strategy = getRunConfig(runNum);

  const initialTips = getInitialTips(question.settings.correctAnswer, strategy);

  const params = {
    id,
    generation: INITIAL_GENERATION_NUMBER,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    runNum: runNum,
    previousTips: initialTips,
    strategy,
  };

  const [data] = await sql`
    INSERT INTO run (id, created_at, updated_at, enabled, question_id, run_num, generation, strategy, previous_tips) 
      VALUES (${params.id}, ${params.createdAt}, ${params.updatedAt}, ${
    params.enabled
  }, ${questionId}, ${params.runNum},
      ${params.generation}, ${params.strategy as any}, ${params.previousTips})
    ON CONFLICT (question_id, run_num) 
    DO UPDATE SET enabled = EXCLUDED.enabled
    RETURNING *
  `;

  return { ...params, ...data, settings: question.settings };
}

export async function getCurrentGenerationTipsV2(
  questionId: string,
  runId: string,
  generationNumber: number,
  { supabase }: ModelContext
): Promise<any | null> {
  const { data } = await supabase
    .from('tip')
    .select()
    .eq('question_id', questionId)
    .eq('run_id', runId)
    .eq('generation', generationNumber);

  return data;
}

export async function createQuestionTipV2(
  {
    tipId,
    id,
    tip,
    runId,
    correctAnswer,
    strategy,
    generation,
    previousTips,
    timeLimit,
    knewAnswer,
    answered,
    msElapsed,
    userId,
  }: {
    tipId: string;
    id: string;
    tip: number;
    runId: string;
    correctAnswer: number;
    strategy: RunStrategy;
    generation: number;
    previousTips: number[];
    timeLimit?: number;
    knewAnswer: boolean;
    answered: boolean;
    msElapsed: number;
    userId: string;
  },
  context: ModelContext & { runLock: RunLock }
) {
  const { runLock, sql } = context;
  const currentTips = await getCurrentGenerationTipsV2(
    id,
    runId,
    generation,
    context
  );

  const currentTipsWithAnswer = currentTips.filter(
    (t: PostgresTip) =>
      !['undefined', 'null'].includes(typeof t.tip) &&
      t.answered !== false &&
      t.knewAnswer !== true
  );

  const params = {
    id: tipId,
    question_id: id,
    runId,
    generation,
    tip,
    previousTips,
    msElapsed,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    correctAnswer,
    timeLimit,
    knewAnswer,
    answered,
  };

  await sql.begin(async (sql) => {
    await sql`
      insert into "tip" (
        id, created_at, generation, tip, run_id, question_id, previous_tips, time_limit, ms_elapsed, knew_answer, answered, created_by
      ) values (
        ${params.id}, ${params.createdAt}, ${params.generation}, ${params.tip}, ${params.runId}, ${params.question_id}, ${params.previousTips},
        ${params.timeLimit}, ${params.msElapsed}, ${params.knewAnswer}, ${params.answered}, ${params.createdBy}
      )
    `;

    // If we hit tips per generation threshold, start new generation by updating RUN
    if (
      answered !== false &&
      knewAnswer !== true &&
      currentTipsWithAnswer.length + 1 >= strategy.tipsPerGeneration &&
      !runLock.getLock(`${runId}#${generation}`)
    ) {
      const [run] =
        await sql`select * from "run" r where r.id = ${runId} AND r.enabled = true`;

      // We first check, whether RUN is still enabled and whether generation is still the same
      if (run && run.generation === generation) {
        // Lock current RUN#GEN to prevent creating multiple generations
        // we release current generation when we create next generation in future
        runLock.lock(`${runId}#${generation}`);

        const allGenerationTips = [
          ...currentTipsWithAnswer.map((t: PostgresTip) => t.tip),
          ...(tip ? [tip] : []),
        ];

        // If we hit max generations, we disable this RUN
        if (generation === strategy.maxGenerations) {
          await sql`update "run" r set enabled = false WHERE r.id = ${runId}`;

          runLock.unlock(`${runId}#${generation - 1}`);
          runLock.unlock(`${runId}#${generation}`);
        } else {
          // new generation and new previous tips
          const newPreviousTips = getNewPreviousTipsV2(
            allGenerationTips,
            correctAnswer,
            strategy
          );

          await sql`update "run" r set generation = ${
            generation + 1
          }, previous_tips = ${newPreviousTips} WHERE r.id = ${runId}`;

          // save generation snapshot to the database
          let generationRows = [];

          if (generation === 1) {
            const oldGenerationId = ulid();
            generationRows = [
              ...generationRows,
              {
                id: oldGenerationId,
                runId,
                generation,
                previousTips,
                createdAt: params.createdAt,
              },
            ];
          }

          const generationId = ulid();

          generationRows = [
            ...generationRows,
            {
              id: generationId,
              runId,
              generation: generation + 1,
              previousTips: newPreviousTips,
              createdAt: params.createdAt,
            },
          ];

          await sql`insert into "generation" ${sql(
            decamelizeKeys(generationRows)
          )}`;

          runLock.unlock(`${runId}#${generation - 1}`);
        }
      }
    }
  });
}
