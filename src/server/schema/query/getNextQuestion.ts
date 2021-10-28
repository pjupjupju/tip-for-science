import { DynamoDB } from 'aws-sdk';
// import { TABLE_QUESTION, TABLE_TIP } from './../../../config';

export async function getNextQuestion(
  parent: any,
  { id }: { id: string },
  { dynamo }: { dynamo: DynamoDB.DocumentClient }
) {
  return {
    id: '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfa',
    question: 'Kolik kilogramů má 100 kilogramů?',
    image:
      'https://cdn.pixabay.com/photo/2013/07/28/12/23/paperclip-168336_1280.jpg',
    previousTips: [],
    correctAnswer: 100,
    unit: 'kg',
  };
}
