import { DynamoDB } from 'aws-sdk';
import { getQuestionBatch } from '../../io';
import { batchCreateQuestions } from '../../model';
import { User } from '../../model/types';

export async function importQuestions(
  parent: any,
  _: any,
  { dynamo, user }: { dynamo: DynamoDB.DocumentClient; user: User }
) {
  // only allow user who is admin, so first load user role

  const questions = await getQuestionBatch(
    '10CKq_4y-vR1YlY0IoOwG6o5NQ5okXzUizq_BJ81eM2I',
    'import'
  );

  const importData = await batchCreateQuestions(questions, { dynamo });

  console.log('import result: ', JSON.stringify(importData));

  return 'ok';
}
