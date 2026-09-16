import {
  getTranslationBatch,
  getTranslationSheets,
} from '../../io/googleSheets';
import { findAllLanguages } from '../../model/language';
import { upsertQuestionTranslations } from '../../model/importTranslations';
import { GraphQLContext } from '../context';
import { requireAdmin } from '../requireAdmin';

export async function importTranslations(
  parent: any,
  { lang }: { lang: string },
  context: GraphQLContext
) {
  await requireAdmin(context);
  try {
    const spreadsheet = process.env.RAZZLE_QUESTIONS_SPREADSHEET;
    const [sheets, languages] = await Promise.all([
      getTranslationSheets(spreadsheet),
      findAllLanguages(context),
    ]);
    if (!sheets.includes(lang)) {
      throw new Error('Select an existing translation sheet.');
    }
    if (!languages.some((language) => language.lang === lang)) {
      throw new Error(
        `Language "${lang}" is not registered. Add it to the language table before importing.`
      );
    }
    const translations = await getTranslationBatch(spreadsheet, lang);
    const result = await upsertQuestionTranslations(lang, translations, context);
    return { success: true, ...result, errors: [] };
  } catch (error) {
    return {
      success: false,
      inserted: 0,
      updated: 0,
      errors: (error.message || 'Translation import failed.').split('\n'),
    };
  }
}
