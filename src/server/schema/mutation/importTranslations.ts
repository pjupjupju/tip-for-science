import { ValidationError } from 'yup';
import decamelizeKeys from 'decamelize-keys';
import { getTranslationBatch } from '../../io';
import { GraphQLContext } from '../context';
import questions from './../../io/questions.json';

// Google spreadsheet ID
const translationsSpreadsheetId =
  '1RJE0l2t5xPGJKIM89zNlndVKSuSvbtpm4lWTE-WcPiU';

export async function importTranslations(
  parent: any,
  _: any,
  { supabase, user }: GraphQLContext
) {
  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  // only allow user who is admin, so first load user role

  const translations = await getTranslationBatch(
    translationsSpreadsheetId,
    'import'
  );

  if (translations.length === 0) {
    // return true but log, that nothing was found to be imported
    console.log('No data to import, skipping database insert.');
    return true;
  }

  /* ENGLISH
  const dataToImport = questions.map((question) => {
    const settings = translations.find(
      (t) => t.question === question.settings.question.S.trim()
    );

    if (!settings) {
      console.log('MISSING: ', question.settings.question.S);
      return null;
    }

    const { qIdInSheet, question: q, ...restSettings } = settings;

    return decamelizeKeys({
      lang: 'cs',
      questionId: question.id,
      ...restSettings,
    });
  });
  */

  const dataToImport = questions.map((q) => {
    const { unit, fact, question } = q.settings;

    return decamelizeKeys({
      lang: 'cs',
      questionId: q.id,
      qT: question.S,
      ...(fact.S !== '' ? { factT: fact.S } : {}),
      ...(unit.S !== '' ? { unitT: unit.S } : {}),
    });
  });

  try {
    const { error } = await supabase
      .from('question_translations')
      .insert(dataToImport);
    console.log('error', error);
  } catch (e) {
    console.log(e);
  }

  // return true for successfull import of all questions, false when something did not succeed
  return true;
}
