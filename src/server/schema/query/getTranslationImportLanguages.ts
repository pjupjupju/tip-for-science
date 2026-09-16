import { getTranslationSheets } from '../../io/googleSheets';
import { GraphQLContext } from '../context';
import { requireAdmin } from '../requireAdmin';

export async function getTranslationImportLanguages(
  _: unknown,
  args: unknown,
  context: GraphQLContext
) {
  await requireAdmin(context);
  try {
    const languages = await getTranslationSheets(
      process.env.RAZZLE_QUESTIONS_SPREADSHEET
    );
    return { languages, errors: [] };
  } catch (error) {
    return {
      languages: [],
      errors: [error.message || 'Could not load spreadsheet languages.'],
    };
  }
}
