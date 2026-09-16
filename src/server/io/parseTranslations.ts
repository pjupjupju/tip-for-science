import { ImportedTranslationSettings } from '../model/types';

export function parseTranslations(
  rows: string[][],
  language: string
): ImportedTranslationSettings[] {
  const seen = new Set<string>();
  const translations: ImportedTranslationSettings[] = [];
  const errors: string[] = [];

  rows.slice(1).forEach((row, index) => {
    const [id = '', question = '', fact = '', unit = ''] = row.map((cell) =>
      String(cell).trim()
    );
    if (row.every((cell) => !String(cell).trim())) return;
    if (!id || !question) {
      errors.push(`Row ${index + 2}: question ID and translated question are required.`);
    } else if (seen.has(id)) {
      errors.push(`Row ${index + 2}: duplicate question ID ${id}.`);
    } else {
      seen.add(id);
      translations.push({
        qIdInSheet: id,
        lang: language,
        qT: question,
        factT: fact,
        unitT: unit,
      });
    }
  });
  if (errors.length) throw new Error(errors.join('\n'));
  if (!translations.length) {
    throw new Error('The selected sheet has no translations to import.');
  }
  return translations;
}
