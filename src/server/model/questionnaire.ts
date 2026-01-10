import { QUESTIONNAIRE_BUNDLE_SIZE } from '../../config';
import { ModelContext, Questionnaire } from './types';

export async function upsertQuestionnaireAnswer(
  {
    questionId,
    value,
    userId,
  }: {
    questionId: number;
    value: number;
    userId: string;
  },
  context: ModelContext
) {
  const { sql } = context;

  const now = new Date();

  const params = {
    questionId,
    userId,
    value,
    createdAt: now,
  };

  await sql`
    INSERT INTO "ipip_answer" (question_id, user_id, value, created_at) 
      VALUES (${params.questionId}, ${params.userId}, ${params.value}, ${params.createdAt})
    ON CONFLICT (question_id, user_id) 
    DO UPDATE SET value = EXCLUDED.value, created_at = EXCLUDED.created_at
  `;

  return { ...params };
}

export async function getCurrentQuestionnaire(
  lastIpipQuestion: number,
  ipipBundle: number[],
  language: string,
  userId: string,
  context: ModelContext
): Promise<Questionnaire[]> {
  const { sql } = context;

  const isLastDefined = lastIpipQuestion !== null && typeof lastIpipQuestion !== 'undefined';
  const start = isLastDefined ? ipipBundle.indexOf(lastIpipQuestion) + 1 : 0;
  const end = start + QUESTIONNAIRE_BUNDLE_SIZE;
  
  const nextQuestionIds = ipipBundle.slice(start, end);

  const data = await sql<Questionnaire[]>`
    SELECT q.id, COALESCE(t.translation, q.item) AS item
      FROM "ipip_questionnaire" q
      LEFT JOIN "ipip_questionnaire_translation" t ON t.item_id = q.id AND t.lang = ${language}
      LEFT JOIN "ipip_answer" a ON a.question_id = q.id AND a.user_id = ${userId}
      WHERE q.id = any(${sql.array([...nextQuestionIds]).value});
  `;

  return data;
}
