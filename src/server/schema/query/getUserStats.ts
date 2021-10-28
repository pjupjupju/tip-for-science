import { DynamoDB } from 'aws-sdk';
// import { TABLE_QUESTION, TABLE_TIP } from './../../../config';

export async function getUserStats(
  parent: any,
  _: {},
  { dynamo }: { dynamo: DynamoDB.DocumentClient }
) {
  const today = new Date();
  let score = Math.random();
  const days = new Array(60).fill(null).map((d, index) => {
    const newDate = new Date();
    score = score + Math.random();
    return {
      day: newDate.setDate(today.getDate() - (60 - index)),
      score: parseFloat(score.toFixed(2)),
    };
  });

  console.log(days);

  return { days };
}
