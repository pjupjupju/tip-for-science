import { DynamoDB } from 'aws-sdk';
import { TABLE_QUESTION } from '../../config';

interface UserModelContext {
  dynamo: DynamoDB.DocumentClient;
}

export async function findLastTipsByQuestion(
  id: string,
  runId: string,
  { dynamo }: UserModelContext
): Promise<any | null> {
  const params = {
    TableName: TABLE_QUESTION,
    KeyConditionExpression:
      '#id = :id and begins_with(#questionskey, :questionskey)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#questionskey': 'questionskey',
    },
    ExpressionAttributeValues: {
      ':id': id,
      ':questionskey': `RUN#${1}`,
    },
  };

  const result = await dynamo.query(params).promise();

  const lastTips = result.Items && result.Items.length > 0 ? result.Items[0].lastTips : null;
  return lastTips;
}
