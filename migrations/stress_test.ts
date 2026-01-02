import { input } from '@inquirer/prompts';
import { DynamoDB } from 'aws-sdk';
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import { ulid } from 'ulid';
import {
  createQuestionTipV2,
  findUserByEmail,
  getEnabledQuestionRunsV2,
  getQuestionWithRun,
} from '../src/server/model';
import { RunCache, RunLock } from '../src/server/io';
import { selectPreviousTipsToDisplay } from '../src/helpers/selectPreviousTipsToDisplay';

function generateTip(correctAnswer: number): number {
  const min = 0.5 * correctAnswer;
  const max = 4 * correctAnswer;

  return parseInt((Math.random() * (max - min) + min).toFixed(0));
}

async function generate() {
  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhanFwZ2hkdnhhdnBpeWdwZWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MzQ5MjUsImV4cCI6MjA0NjMxMDkyNX0.KBBzWqtIte4PDM9qpYugIpvwgoe9vn3MVAtuSZgSN_w';
  const dbPassword = 'kUG1B631ZqnIMPt_71';

  const dynamo = new DynamoDB.DocumentClient({
    endpoint: 'http://localhost:8000',
    region: 'eu-central-1',
  });

  const supabaseUrl = 'https://lajqpghdvxavpiygpekv.supabase.co';
  const supabase = createClient(supabaseUrl, supabaseKey);
  const sql = postgres(
    `postgresql://postgres.lajqpghdvxavpiygpekv:${dbPassword}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`,
    { transform: postgres.toCamel }
  );

  const runCache = new RunCache(15, 5, { dynamo, sql, supabase });
  const runLock = new RunLock();

  const questionId = await input({
    message: 'Provide question ID from database:',
    required: true,
  });

  const user = await findUserByEmail('carpathian.outlaw@gmail.com', {
    dynamo,
  });

  // correct: runRecord.settings.correctAnswer,

  for (let i = 0; i < 500; i++) {
    const nextQuestionRuns = await getEnabledQuestionRunsV2(questionId, {
      sql,
      dynamo,
      supabase,
    });

    // get the preferred run from cache
    const runRecord = await runCache.getRunV2(questionId, nextQuestionRuns);

    const rId = runRecord.runNum;
    const gId = runRecord.generation;

    const previousTips = selectPreviousTipsToDisplay(
      runRecord.previousTips,
      runRecord.strategy
    );

    const question = await getQuestionWithRun(questionId, rId, {
      sql,
      dynamo,
      supabase,
    });

    const { strategy, settings, runId } = question;
    const tipId = ulid();

    const tip = generateTip(runRecord.settings.correctAnswer);

    await createQuestionTipV2(
      {
        tipId,
        id: questionId,
        tip,
        runId, // UUID
        correctAnswer: settings.correctAnswer,
        strategy: {
          maxGenerations: strategy.maxGenerations,
          numTipsToShow: strategy.numTipsToShow,
          selectionPressure: strategy.selectionPressure,
          tipsPerGeneration: strategy.tipsPerGeneration,
        },
        generation: gId,
        previousTips,
        timeLimit: settings.timeLimit,
        knewAnswer: false,
        answered: true,
        msElapsed: 100,
        userId: user!.id,
      },
      {
        sql,
        dynamo,
        supabase,
        runLock,
      }
    );
  }

  console.log('\n');
  console.log('\n');

  console.log(`✅ Stress test completed for question "${questionId}". `);
}

generate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
