import { ValidationError } from 'yup';
import { getQuestionBatch } from '../../io';
import {
  batchCreateQuestionsV2,
  getNotImportedQuestions,
} from '../../model';
import { GraphQLContext } from '../context';

// Google spreadsheet ID
const spreadsheetId = process.env.RAZZLE_QUESTIONS_SPREADSHEET;

export async function importQuestions(
  parent: any,
  _: any,
  context: GraphQLContext
) {
  const { user } = context;

  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  // only allow user who is admin, so first load user role
  const questions = await getQuestionBatch(
    spreadsheetId,
    'import',
  );

  if (questions.length === 0) {
    // return true but log, that nothing was found to be imported
    console.log('No data to import, skipping database insert.');
    return true;
  }

  const importData = await batchCreateQuestionsV2(questions, context);
  let notImported = [];

  if (importData.some((chunk) => chunk.error)) {
    notImported = await getNotImportedQuestions(questions, context);

    console.error(
      'Unprocessed questions for import: ',
      JSON.stringify(notImported)
    );
  }

  // return true for successfull import of all questions, false when something did not succeed
  return notImported.length === 0;
}
