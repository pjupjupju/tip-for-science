import assert from 'assert/strict';
import postgres from 'postgres';
import { upsertQuestionTranslations } from '../src/server/model/importTranslations';
import { ModelContext } from '../src/server/model/types';

async function main() {
  const url = new URL(process.env.TEST_DATABASE_URL || '');
  assert(['localhost', '127.0.0.1'].includes(url.hostname));
  assert.equal(url.pathname, '/translation_import_test');
  const schema = `translation_test_${Date.now()}`;
  const sql = postgres(url.toString(), {
    transform: postgres.toCamel,
    connection: { search_path: schema },
    max: 4,
  });
  const context = { sql } as ModelContext;
  const row = (id: string, text: string) => ({
    qIdInSheet: id, lang: 'pl', qT: text, factT: '', unitT: '',
  });
  try {
    await sql`CREATE SCHEMA ${sql(schema)}`;
    await sql`CREATE TABLE question (id text PRIMARY KEY, id_in_sheet int)`;
    await sql`CREATE TABLE question_translations (
      question_id text REFERENCES question(id), lang text, q_t text, fact_t text, unit_t text
    )`;
    await sql`INSERT INTO question VALUES ('generated-a', 1), ('generated-b', 2), ('generated-c', 3)`;
    await sql`INSERT INTO question_translations VALUES ('generated-a', 'pl', 'old', '', ''), ('generated-a', 'en', 'English', '', '')`;

    assert.deepEqual(await upsertQuestionTranslations('pl', [row('1', 'updated'), row('2', 'new')], context), { inserted: 1, updated: 1 });
    assert.deepEqual(await upsertQuestionTranslations('pl', [row('1', 'updated'), row('2', 'new')], context), { inserted: 0, updated: 2 });
    const records = await sql`SELECT * FROM question_translations ORDER BY question_id, lang`;
    assert.equal(records.length, 3);
    assert.equal(records[0].qT, 'English');
    assert.equal(records[1].qT, 'updated');
    assert.equal(records[2].questionId, 'generated-b');

    await assert.rejects(upsertQuestionTranslations('pl', [row('1', 'must not save'), row('999', 'unknown')], context), /999.*not found/);
    assert.equal((await sql`SELECT q_t FROM question_translations WHERE question_id = 'generated-a' AND lang = 'pl'`)[0].qT, 'updated');

    await sql`INSERT INTO question VALUES ('duplicate-sheet-id', 2)`;
    await assert.rejects(upsertQuestionTranslations('pl', [row('2', 'ambiguous')], context), /multiple questions/);

    await Promise.all([
      upsertQuestionTranslations('pl', [row('3', 'concurrent-a')], context),
      upsertQuestionTranslations('pl', [row('3', 'concurrent-b')], context),
    ]);
    assert.equal((await sql`SELECT * FROM question_translations WHERE question_id = 'generated-c' AND lang = 'pl'`).length, 1);
    console.log('PostgreSQL translation checks passed: mixed upsert, repeat import, language isolation, invalid-ID rollback, ambiguous IDs, concurrent imports.');
  } finally {
    await sql.end();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
