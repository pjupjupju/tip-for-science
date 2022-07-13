import { DynamoDB } from 'aws-sdk';
import { ulid } from 'ulid';
import {
  MAX_TOO_CLOSE_ANSWERS_PER_GENERATION,
  TABLE_QUESTION,
} from '../../config';
import { DynamoQuestion, RunStrategy } from './types';

interface UserModelContext {
  dynamo: DynamoDB.DocumentClient;
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
    id,
    tip,
    run,
    correctAnswer,
    strategy,
    generation,
    previousTips,
    knewAnswer,
    msElapsed,
    userId,
  }: {
    id: string;
    tip: number;
    run: number;
    correctAnswer: number;
    strategy: RunStrategy;
    generation: number;
    previousTips: number[];
    knewAnswer: boolean;
    msElapsed: number;
    userId: string;
  },
  { dynamo }: UserModelContext
) {
  const tipId = ulid();

  const currentTips = await getCurrentGenerationTips(id, run, generation, {
    dynamo,
  });

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
        if (currentTips.length + 1 === strategy.tipsPerGeneration) {
          const allGenerationTips = [
            ...currentTips.map((t: any) => t.data.tip),
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

          // new generatoion and new previous tips
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
  // TODO: do we want to use Math.floor? How do we make sure, we never create FLOAT?
  const numTipsToRemove = Math.floor(selectionPressure * tips.length);
  return tips
    .sort((a, b) => Math.abs(correctAnswer - a) - Math.abs(correctAnswer - b))
    .slice(0, -numTipsToRemove);
}

// TODO: get rid of this ANY
function isGenerationTooCloseToCorrectAnswer(
  tips: number[],
  correctAnswer: number
): boolean {
  const fraction = 0.1 * correctAnswer;

  return (
    MAX_TOO_CLOSE_ANSWERS_PER_GENERATION <=
    tips.reduce((count: number, t: number) => {
      // MATH:
      if (Math.abs(correctAnswer - t) <= fraction) {
        return count + 1;
      }
      return count;
    }, 0)
  );
}
