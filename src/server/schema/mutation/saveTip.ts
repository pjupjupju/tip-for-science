import { DynamoDB } from 'aws-sdk';
import { TABLE_QUESTION, TABLE_TIP } from './../../../config';

export async function saveTip(
  parent: any,
  { id, tip }: { id: string; tip: number },
  { dynamo }: { dynamo: DynamoDB.DocumentClient }
) {
  console.log(`--- updating Question ${id} with tip ${tip}`);
  await dynamo.put({
    TableName: TABLE_TIP,
    Item: {
      question_id: id,
      tip,
      user_id: 21,
      created_at: new Date(),
    },
  });

  // TODO: get next question id somehow
  const nextQuestionId = 'flop';

  const question = dynamo.query({
    TableName: TABLE_QUESTION,
    KeyConditionExpression: 'ID = :id',
    ExpressionAttributeValues: { ':id': nextQuestionId },
    ScanIndexForward: false,
    Limit: 1,
  });

  const lastTips = dynamo.query({
    TableName: TABLE_TIP,
    KeyConditionExpression: 'question_id = :id',
    ExpressionAttributeValues: { ':id': nextQuestionId },
    ScanIndexForward: false,
    Limit: 2,
  }) as any;

  await Promise.all([question, lastTips]);

  return {
    ...question,
    previousTips: lastTips.map(
      (previousTip: { tip: number }) => previousTip.tip
    ),
  };

  /*
  return {
    id: '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfa',
    question: 'How much is the fleeb?',
    image:
      'https://cdn.pixabay.com/photo/2013/07/28/12/23/paperclip-168336_1280.jpg',
    previousTips: [],
    correctAnswer: 15,
    unit: 'kg',
  }; */
}
