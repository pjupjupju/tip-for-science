import { DynamoDB } from 'aws-sdk';
import { TABLE_QUESTION } from '../../config';

interface UserModelContext {
  dynamo: DynamoDB.DocumentClient;
}

export async function getGameQuestion(
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
  const question: any = await dynamo // TODO: get rid of this any!
    .query({
      TableName: TABLE_QUESTION,
      KeyConditionExpression: '#id = :id and begins_with(#qsk, :qsk)',
      ExpressionAttributeNames: {
        '#id': 'id',
        '#qsk': 'qsk',
      },
      ExpressionAttributeValues: {
        ':id': id,
        ':qsk': 'QDATA#',
      },
    })
    .promise();

  const runId = question.run + 1;
  const runIndex = runId - 1;

  const params = {
    id: question.id,
    qsk: `Q#${question.id}#true#R#${runId}`,
    gsi_pk: `Q#${question.id}#true#R#${runId}`,
    gsi_sk: `Q#${question.id}#R#${runId}`,
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

  return dynamo
    .put({
      ReturnValues: 'ALL_OLD',
      TableName: TABLE_QUESTION,
      Item: params,
    })
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

export async function updateCurrentGeneration(
  questionId: string,
  runId: string,
  newCurrentGeneration: number,
  { dynamo }: UserModelContext
): Promise<any> {
  const params = {
    TableName: TABLE_QUESTION,
    Key: { id: questionId, qsk: `${questionId}#true#R#${runId}` },
    UpdateExpression: 'set generation = :newCurrentGeneration',
    ExpressionAttributeValues: {
      ':newCurrentGeneration': newCurrentGeneration,
    },
  };

  return dynamo.update(params).promise();
}

export async function disableRun(
  questionId: string,
  runId: string,
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
