import { ImportedTranslationSettings, ModelContext } from './types';

export async function upsertQuestionTranslations(
  language: string,
  translations: ImportedTranslationSettings[],
  { sql }: ModelContext
) {
  const rows = translations.map(row => ({
    sheet_id: row.qIdInSheet,
    q_t: row.qT,
    fact_t: row.factT,
    unit_t: row.unitT,
  }));

  return sql.begin(async transaction => {
    // ponytail: serialize admin imports; use a unique constraint + ON CONFLICT if other writers are added.
    await transaction`SELECT pg_advisory_xact_lock(73421, 1)`;
    const invalid = await transaction`
      SELECT source.sheet_id, count(q.id)::int AS matches
      FROM jsonb_to_recordset(${sql.json(rows)}::jsonb)
        AS source(sheet_id text, q_t text, fact_t text, unit_t text)
      LEFT JOIN question q ON q.id_in_sheet::text = source.sheet_id
      GROUP BY source.sheet_id
      HAVING count(q.id) <> 1
    `;
    if (invalid.length) {
      throw new Error(invalid.map(row =>
        `Question ID ${row.sheetId}: ${row.matches === 0 ? 'not found' : 'matches multiple questions'} in the question database.`
      ).join('\n'));
    }

    const [result] = await transaction`
      WITH source AS (
        SELECT q.id AS question_id, input.q_t, input.fact_t, input.unit_t
        FROM jsonb_to_recordset(${sql.json(rows)}::jsonb)
          AS input(sheet_id text, q_t text, fact_t text, unit_t text)
        JOIN question q ON q.id_in_sheet::text = input.sheet_id
      ), updated AS (
        UPDATE question_translations target
        SET q_t = source.q_t, fact_t = source.fact_t, unit_t = source.unit_t
        FROM source
        WHERE target.question_id = source.question_id AND target.lang = ${language}
        RETURNING target.question_id
      ), inserted AS (
        INSERT INTO question_translations (question_id, lang, q_t, fact_t, unit_t)
        SELECT source.question_id, ${language}, source.q_t, source.fact_t, source.unit_t
        FROM source
        WHERE NOT EXISTS (
          SELECT 1 FROM question_translations target
          WHERE target.question_id = source.question_id AND target.lang = ${language}
        )
        RETURNING question_id
      )
      SELECT (SELECT count(*)::int FROM updated) AS updated,
             (SELECT count(*)::int FROM inserted) AS inserted
    `;
    return { updated: result.updated, inserted: result.inserted };
  });
}
