import fs from 'fs';
import { AWSError } from 'aws-sdk';
import { ScanOutput } from 'aws-sdk/clients/dynamodb';
import { format } from '@fast-csv/format';
import decamelizeKeys from 'decamelize-keys';
import toCamelCase from 'camelcase-keys';
import { ulid } from 'ulid';
import {
  INITIAL_GENERATION_NUMBER,
  TABLE_QUESTION,
  TABLE_USER,
} from '../../config';
import { generateQuestionBundle, sliceIntoChunks } from '../../helpers';
import {
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

// --------------------- POSTGRES ----------------------------

export async function batchCreateQuestions(
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

export async function getEnabledQuestionRuns(
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

export async function getQuestionCorpus(supabase: ModelContext['supabase']) {
  const { data } = await supabase.from('question').select();

  return data.map((item) => toCamelCase(item));
}

export async function getQuestion(id: string, { supabase }: ModelContext) {
  const {
    data: [question],
  } = await supabase.from('question').select().eq('id', id);

  return question;
}

export async function getQuestionRun(id: string, { supabase }: ModelContext) {
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

function logDist(t: number, correctAnswer: number) {
  if (t <= 0 || correctAnswer <= 0) return Number.POSITIVE_INFINITY;
  return Math.abs(Math.log(t / correctAnswer));
}

function getNewPreviousTips(
  tips: number[],
  correctAnswer: number,
  { selectionPressure }: RunStrategy
): number[] {
  const numTipsToRemove = Math.floor(selectionPressure * tips.length);
  return tips
    .slice()
    .sort((a, b) => logDist(a, correctAnswer) - logDist(b, correctAnswer))
    .slice(0, numTipsToRemove >= 1 ? -numTipsToRemove : tips.length)
    .sort(() => Math.random() - 0.5);
}

export async function createQuestionRun(
  questionId: string,
  userId: string,
  context: ModelContext
) {
  const { sql } = context;
  const question = await getQuestionWithHighestRun(questionId, context);
  console.log(
    'creating new run while the existing question+run are:',
    JSON.stringify(question)
  );

  const runNum = question?.run + 1;

  const id = ulid();

  const strategy = getRunConfig(runNum);

  const initialTips = getInitialTips(question.settings.correctAnswer, strategy);

  const params = {
    id,
    generation: INITIAL_GENERATION_NUMBER,
    enabled: true,
    createdAt: new Date().toISOString(),
    createdBy: userId,
    updatedAt: new Date().toISOString(),
    runNum: runNum,
    previousTips: initialTips,
    strategy,
  };

  const [data] = await sql`
    INSERT INTO run (id, created_at, created_by, updated_at, enabled, question_id, run_num, generation, strategy, previous_tips) 
      VALUES (${params.id}, ${params.createdAt}, ${params.createdBy}, ${
    params.updatedAt
  }, ${params.enabled}, ${questionId}, ${params.runNum},
      ${params.generation}, ${params.strategy as any}, ${params.previousTips})
      ON CONFLICT (question_id, run_num)
      DO UPDATE SET enabled = EXCLUDED.enabled
    RETURNING *
  `;

  return { ...params, ...data, settings: question.settings };
}

export async function getCurrentGenerationTips(
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

export async function createQuestionTip(
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
  const currentTips = await getCurrentGenerationTips(
    id,
    runId,
    generation,
    context
  );

  const currentTipsWithAnswer = currentTips.filter(
    (t: PostgresTip) =>
      !['undefined', 'null'].includes(typeof t.tip) &&
      t.tip !== 0 &&
      t.answered !== false &&
      t.knewAnswer !== true
  );

  const now = new Date().toISOString();

  const params = {
    id: tipId,
    question_id: id,
    runId,
    generation,
    tip,
    previousTips,
    msElapsed,
    createdBy: userId,
    createdAt: now,
    correctAnswer,
    timeLimit,
    knewAnswer,
    answered,
  };

  await sql.begin(async (t) => {
    await t`
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
        await t`select * from "run" r where r.id = ${runId} AND r.enabled = true`;

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
          await t`update "run" r set enabled = false, updated_at = ${now} WHERE r.id = ${runId}`;

          runLock.unlock(`${runId}#${generation - 1}`);
          runLock.unlock(`${runId}#${generation}`);
        } else {
          // new generation and new previous tips
          const newPreviousTips = getNewPreviousTips(
            allGenerationTips,
            correctAnswer,
            strategy
          );

          await t`update "run" r set generation = ${
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

          await t`insert into "generation" ${sql(
            decamelizeKeys(generationRows)
          )}`;

          runLock.unlock(`${runId}#${generation - 1}`);
        }
      }
    }
  });
}

export async function exportTipDataV2({ sql }: ModelContext): Promise<string> {
  let downloadUrl: Promise<string> | string;

  const headers = [
    'time',
    'date',
    'itemId',
    'participantId',
    'questionId',
    'questionSheetId',
    'runId',
    'generationId',
    'correct',
    'nparents',
    'parent1',
    'parent2',
    'parent3',
    'parent4',
    'answered',
    'knewAnswer',
    'answertime',
    'limit',
    'tip',
    'numTipsToShow',
    'popSize',
    'selectionPressure',
    'maxGenerations',
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

  const BATCH_SIZE = 2000;

  let lastCreatedAt: string | null = null;
  let lastId: string | null = null;

  while (true) {
    const rows = await sql`
      SELECT
        t.id as id,
        t.created_at as created_at,
        t.created_by as created_by,
        t.question_id as question_id,
        t.generation as generation,
        t.previous_tips as previous_tips,
        t.answered as answered,
        t.knew_answer as knew_answer,
        t.ms_elapsed as ms_elapsed,
        t.time_limit as time_limit,
        t.tip as tip,
        q.id_in_sheet as question_sheet_id,
        COALESCE(
          (q.settings->>'correctAnswer')::numeric,
          (q.settings->>'correct_answer')::numeric
        ) as correct_answer,
        COALESCE(
          (r.strategy->>'maxGenerations')::numeric,
          (r.strategy->>'max_generations')::numeric
        ) as max_generations,
        COALESCE(
          (r.strategy->>'selectionPressure')::numeric,
          (r.strategy->>'selection_pressure')::numeric
        ) as selection_pressure,
        COALESCE(
          (r.strategy->>'numTipsToShow')::numeric,
          (r.strategy->>'num_tips_to_show')::numeric
        ) as num_tips_to_show,
        COALESCE(
          (r.strategy->>'tipsPerGeneration')::numeric,
          (r.strategy->>'tip_per_generation')::numeric
        ) as tips_per_generation,
        r.run_num
      FROM tip t
      JOIN question q ON q.id = t.question_id
      JOIN run r ON r.id = t.run_id
      WHERE ${
        lastCreatedAt === null
          ? sql`true`
          : sql`(t.created_at, t.id) > (${lastCreatedAt}::timestamptz, ${lastId}::text)`
      }
      ORDER BY t.created_at ASC, t.id ASC
      LIMIT ${BATCH_SIZE}
    `;

    if (!rows || rows.length === 0) {
      break;
    }

    for (const row of rows) {
      const {
        id,
        answered,
        knewAnswer,
        msElapsed,
        createdAt,
        createdBy,
        previousTips,
        correctAnswer,
        questionId,
        questionSheetId,
        generation,
        runNum,
        timeLimit,
        tip,
        numTipsToShow,
        tipsPerGeneration,
        selectionPressure,
        maxGenerations,
      } = row;

      const createdISO =
        typeof createdAt === 'string'
          ? createdAt
          : createdAt instanceof Date
          ? createdAt.toISOString()
          : String(createdAt);

      stream.write({
        time: new Date(Date.parse(createdISO))
          .toTimeString()
          .split('(')[0]
          .trim(),
        date: createdISO.substring(0, 10),
        itemId: id, // pozor: v headers máš itemID, v původním objektu itemId
        participantId: createdBy,
        questionId,
        questionSheetId,
        runId: runNum,
        generationId: generation,
        correct: correctAnswer ?? '',
        nparents: Array.isArray(previousTips) ? previousTips.length : 0,
        parent1: returnValueOrEmptyString(previousTips?.[0]),
        parent2: returnValueOrEmptyString(previousTips?.[1]),
        parent3: returnValueOrEmptyString(previousTips?.[2]),
        parent4: returnValueOrEmptyString(previousTips?.[3]),
        answered: returnValueOrEmptyString(answered).toString(),
        knewAnswer: returnValueOrEmptyString(knewAnswer).toString(),
        answertime: msElapsed,
        limit:
          typeof timeLimit === 'undefined' || timeLimit === null
            ? 'false'
            : timeLimit * 1000,
        tip,
        numTipsToShow,
        popSize: tipsPerGeneration,
        selectionPressure,
        maxGenerations,
      });
    }

    // update cursor to last row in this batch
    const last = rows[rows.length - 1];
    const batchLastCreatedAt = last.createdAt;

    lastCreatedAt =
      typeof batchLastCreatedAt === 'string'
        ? batchLastCreatedAt
        : batchLastCreatedAt instanceof Date
        ? batchLastCreatedAt.toISOString()
        : String(batchLastCreatedAt);

    lastId = last.id;
  }

  if (process.env.NODE_ENV === 'production') {
    downloadUrl = uploadCsvToS3(stream, `export-tipdata-${Date.now()}`);
  } else {
    downloadUrl = 'local';
  }

  stream.end();

  return downloadUrl;
}
