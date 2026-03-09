import { ValidationError } from 'yup';
import decamelizeKeys from 'decamelize-keys';
import { getTranslationBatch } from '../../io';
import { GraphQLContext } from '../context';
import {
  findAllLanguages,
  getQuestionsIdsAndSpreadsheetIds,
} from '../../model';

// Google spreadsheet ID
const translationsSpreadsheetId = process.env.RAZZLE_QUESTIONS_SPREADSHEET;

export async function importTranslations(
  parent: any,
  { lang }: { lang: string },
  context: GraphQLContext
) {
  const { supabase, user } = context;

  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  // only allow user who is admin, so first load user role

  const languages = await findAllLanguages(context);

  const existingLanguage = languages.find((i) => i.lang === lang);

  if (!existingLanguage) {
    console.log('language does not exist');
    return false;
  }

  const translations = await getTranslationBatch(
    translationsSpreadsheetId,
    lang
  );

  if (translations.length === 0) {
    // return true but log, that nothing was found to be imported
    console.log('No data to import, skipping database insert.');
    return true;
  }

  const questionList = await getQuestionsIdsAndSpreadsheetIds(context);

  const dataToImport = translations.map((i) => ({
    lang,
    questionId: questionList[i.qIdInSheet],
    qT: i.qT,
    factT: i.factT,
    unitT: i.unitT,
  }));

  try {
    await supabase
      .from('question_translations')
      .insert(decamelizeKeys(dataToImport));
  } catch (e) {
    console.log(e);
  }

  // return true for successfull import of all questions, false when something did not succeed
  return true;
}
