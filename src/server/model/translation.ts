import { SupabaseClient } from '@supabase/supabase-js';
import toCamelCase from 'camelcase-keys';
import { QuestionTranslationRecord } from './types';

export interface TranslationModelContext {
  supabase: SupabaseClient;
}

export async function getQuestionTranslation(
  questionId: string,
  { supabase }: TranslationModelContext
): Promise<QuestionTranslationRecord> {
  const {
    data: [translation],
  } = await supabase
    .from('question_translations')
    .select('q_t,fact_t,unit_t')
    .eq('question_id', questionId);

  return toCamelCase(translation);
}
