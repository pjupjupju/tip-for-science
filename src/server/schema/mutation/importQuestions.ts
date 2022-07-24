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

  if (questions.length === 0) {
    // return true but log, that nothing was found to be imported
    console.log('No data to import, skipping database insert.');
    return true;
  }

  const importData = await batchCreateQuestions(questions, { dynamo });

  const notImported = importData
    .filter(
      (result) =>
        result['UnprocessedItems'] &&
        Object.keys(result['UnprocessedItems']).length !== 0
    )
    .map((result) =>
      console.error(
        'Unprocessed questions for import: ',
        JSON.stringify(result['UnprocessedItems'])
      )
    );

  // return true for successfull import of all questions, false when something did not succeed
  return notImported.length === 0;
}
