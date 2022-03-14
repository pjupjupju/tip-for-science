import { DynamoDB } from 'aws-sdk';
import { TABLE_QUESTION } from '../../config';

interface UserModelContext {
  dynamo: DynamoDB.DocumentClient;
}


// TODO: create whole code
export async function getGameQuestion(
  id: string,
  runId: string,
  { dynamo }: UserModelContext
): Promise<any | null> {
  const params = {
    TableName: TABLE_QUESTION,
    KeyConditionExpression:
      '#id = :id and begins_with(#qsk, :qsk)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#qsk': 'qsk',
    },
    ExpressionAttributeValues: {
      ':id': id,
      ':qsk': `RUN#${1}`,
    },
  };

  const result = await dynamo.query(params).promise();

  const lastTips = result.Items && result.Items.length > 0 ? result.Items[0].lastTips : null;
  return lastTips;
}


export async function findLastTipsByQuestion(
  id: string,
  runId: string,
  { dynamo }: UserModelContext
): Promise<any | null> {
  const params = {
    TableName: TABLE_QUESTION,
    KeyConditionExpression:
      '#id = :id and begins_with(#qsk, :qsk)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#qsk': 'qsk',
    },
    ExpressionAttributeValues: {
      ':id': id,
      ':qsk': `RUN#${1}`,
    },
  };

  const result = await dynamo.query(params).promise();

  const lastTips = result.Items && result.Items.length > 0 ? result.Items[0].lastTips : null;
  return lastTips;
}
