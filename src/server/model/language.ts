import { ModelContext, Language } from './types';

export async function findAllLanguages(
  context: ModelContext
): Promise<Language[]> {
  const { sql } = context;

  const data = await sql<Language[]>`
    SELECT * FROM "language" l
    ORDER BY l.lang ASC
  `;

  return data;
}
