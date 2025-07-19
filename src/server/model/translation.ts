import { SupabaseClient } from '@supabase/supabase-js';
import toCamelCase from 'camelcase-keys';
import { QuestionTranslationRecord } from './types';
import { Sql } from 'postgres';

export interface TranslationModelContext {
  supabase: SupabaseClient;
  sql: Sql;
}

export async function getQuestionTranslation(
  questionId: string,
  desiredLanguage: string,
  { sql }: TranslationModelContext
): Promise<QuestionTranslationRecord> {
  const [translation] = (await sql`
    SELECT q_t,fact_t,unit_t FROM question_translations
    WHERE question_id = ${questionId} AND lang IN (${desiredLanguage}, 'en')
    ORDER BY CASE WHEN lang = ${desiredLanguage} THEN 0 ELSE 1 END
    LIMIT 1
    `) as QuestionTranslationRecord[];

  return translation;
}
