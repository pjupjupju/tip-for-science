import { getTranslationBatch, getTranslationSheets } from './googleSheets';
const mockGet = jest.fn();
const mockValuesGet = jest.fn();
jest.mock('googleapis', () => ({ google: {
  auth: { JWT: jest.fn() },
  sheets: () => ({ spreadsheets: { get: mockGet, values: { get: mockValuesGet } } }),
} }));
jest.mock('./google-credentials.json', () => ({ client_email: 'test', private_key: 'test' }));

test('sheet discovery excludes only the original import tab', async () => {
  mockGet.mockResolvedValue({ data: { sheets: ['import', 'en', 'pl'].map(title => ({ properties: { title } })) } });
  expect(await getTranslationSheets('test-sheet')).toEqual(['en', 'pl']);
});

test('translation sheet parsing handles short rows and quotes the selected tab', async () => {
  mockValuesGet.mockResolvedValue({ data: { values: [['ID', 'Q'], ['1', 'Question']] } });
  expect(await getTranslationBatch('test-sheet', 'pl')).toEqual([{ qIdInSheet: '1', lang: 'pl', qT: 'Question', factT: '', unitT: '' }]);
  expect(mockValuesGet).toHaveBeenCalledWith(expect.objectContaining({ spreadsheetId: 'test-sheet', range: "'pl'!A1:D" }));
});

test('Google API errors propagate', async () => {
  mockValuesGet.mockRejectedValue(new Error('API unavailable'));
  await expect(getTranslationBatch('test-sheet', 'pl')).rejects.toThrow('API unavailable');
});
