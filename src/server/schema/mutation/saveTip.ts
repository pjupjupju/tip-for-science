import { DynamoDB } from 'aws-sdk';
import { ulid } from 'ulid';
import { User } from '../../model/types';
import { TABLE_QUESTION } from './../../../config';

export async function saveTip(
  parent: any,
  { id, tip }: { id: string; tip: number },
  { dynamo, user }: { dynamo: DynamoDB.DocumentClient; user: User }
) {
  console.log(`--- updating Question ${id} with tip ${tip}`);

  const tipId =  ulid();

  const question = await dynamo.put({
    TableName: TABLE_QUESTION,
    Item: {
      id,
      questionskey: `RUN#${1}`,
      lastTips: [tip],
    },
  }).promise();

  console.log(question);

  /*

  await dynamo.put({
    TableName: TABLE_USER,
    Item: {
      id: "01FGFWT7TPF5G3CEEGQHH7BAGX",
      question_id: id,
      userskey: `TIP#${tipId}`,
      tip,
      created_at: new Date(),
    },
  });
  */

  // TODO: get next question id somehow
  const nextQuestionId = 'flop';

  return {
    tipId
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
