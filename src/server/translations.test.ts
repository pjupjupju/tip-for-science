import { decode } from 'jsonwebtoken';
import { signUp } from './schema/mutation/signUp';
import { signIn } from './schema/mutation/signIn';
import { updateUser } from './schema/mutation/updateUser';
import { getNextQuestion } from './schema/query/getNextQuestion';
import { getQuestionnaire } from './schema/query/getQuestionnaire';
import { importTranslations } from './schema/mutation/importTranslations';
import { importQuestions } from './schema/mutation/importQuestions';
import { getTranslationImportLanguages } from './schema/query/getTranslationImportLanguages';
import * as model from './model';
import { findUserById as findAdmin } from './model/user';
import { detectLanguage } from './io/detectLanguage';
import { getTranslationBatch, getTranslationSheets } from './io/googleSheets';
import { upsertQuestionTranslations } from './model/importTranslations';
import { parseTranslations } from './io/parseTranslations';

jest.mock('./model', () => ({
  createUser: jest.fn(), findUserByEmail: jest.fn(), findUserById: jest.fn(),
  updateUserSettings: jest.fn(), findAllLanguages: jest.fn(),
  getEnabledQuestionRuns: jest.fn(), updateLastQuestion: jest.fn(),
  getQuestionTranslation: jest.fn(), getCurrentQuestionnaire: jest.fn(),
}));
jest.mock('./model/user', () => ({ findUserById: jest.fn() }));
jest.mock('./model/language', () => ({ findAllLanguages: jest.fn(() => Promise.resolve([{ lang: 'pl' }])) }));
jest.mock('./model/importTranslations', () => ({ upsertQuestionTranslations: jest.fn() }));
jest.mock('./io/detectLanguage', () => ({ detectLanguage: jest.fn() }));
jest.mock('./io/googleSheets', () => ({ getTranslationBatch: jest.fn(), getTranslationSheets: jest.fn() }));
jest.mock('./io', () => ({ getQuestionBatch: jest.fn() }));
jest.mock('bcryptjs', () => ({ compareSync: () => true, hashSync: () => 'hashed' }));

const mocked = (fn: any): jest.Mock => fn;
let context: any;

beforeEach(() => {
  jest.clearAllMocks();
  context = {
    user: { id: 'user', language: 'cs' },
    request: { ip: '127.0.0.1', session: { save: jest.fn(callback => callback()) } },
    response: { cookie: jest.fn() },
    runCache: { getRun: jest.fn().mockResolvedValue({ settings: { question: 'source', fact: 'source', unit: '' }, previousTips: [], strategy: {} }) },
  };
  mocked(model.findAllLanguages).mockResolvedValue([{ lang: 'en' }, { lang: 'cs' }, { lang: 'pl' }]);
  mocked(findAdmin).mockResolvedValue({ id: 'user', role: 'admin' });
});

test('signup stores the suggested language in the session token and saves the session', async () => {
  mocked(detectLanguage).mockResolvedValue({ country: 'PL', language: 'pl' });
  mocked(model.createUser).mockResolvedValue({ id: 'new', language: 'pl' });
  await signUp(null, { email: 'new@example.com', password: 'password' }, context);
  expect(model.createUser).toHaveBeenCalledWith(expect.objectContaining({ language: 'pl' }), context);
  expect(decode(context.request.session.token)).toMatchObject({ id: 'new', language: 'pl' });
  expect(context.request.session.save).toHaveBeenCalled();
  expect(context.response.cookie).toHaveBeenCalledWith('tfs_language', 'pl', expect.objectContaining({ httpOnly: true, sameSite: 'lax' }));
});

test('existing saved language is preserved even when country is missing', async () => {
  mocked(model.findUserByEmail).mockResolvedValue({ id: 'old', language: 'pl', password: 'hashed' });
  await signIn(null, { email: 'old@example.com', password: 'password' }, context);
  expect(detectLanguage).not.toHaveBeenCalled();
  expect(model.updateUserSettings).not.toHaveBeenCalled();
  expect(decode(context.request.session.token)).toMatchObject({ language: 'pl' });
  expect(context.response.cookie).toHaveBeenCalledWith('tfs_language', 'pl', expect.any(Object));
});

test('existing user without a language gets a persisted suggestion', async () => {
  mocked(model.findUserByEmail).mockResolvedValue({ id: 'old', country: 'CZ', password: 'hashed' });
  mocked(detectLanguage).mockResolvedValue({ country: 'PL', language: 'pl' });
  await signIn(null, { email: 'old@example.com', password: 'password' }, context);
  expect(model.updateUserSettings).toHaveBeenCalledWith('old', { country: 'CZ', language: 'pl' }, context);
});

test('saving a language persists the preference and refreshes the token', async () => {
  mocked(model.findUserById).mockResolvedValue({ language: 'cs' });
  await updateUser(null, { language: 'pl' }, context);
  expect(model.updateUserSettings).toHaveBeenCalledWith('user', { language: 'pl' }, context);
  expect(decode(context.request.session.token)).toMatchObject({ language: 'pl' });
  expect(context.response.cookie).toHaveBeenCalledWith('tfs_language', 'pl', expect.any(Object));
});

test('invalid language is rejected before changing the account', async () => {
  mocked(model.findUserById).mockResolvedValue({ language: 'pl' });
  await expect(updateUser(null, { language: 'invalid' }, context)).rejects.toThrow('Unsupported language');
  expect(model.updateUserSettings).not.toHaveBeenCalled();
  expect(context.response.cookie).not.toHaveBeenCalled();
});

test('questions and questionnaires use the current account language despite a stale token', async () => {
  mocked(model.findUserById).mockResolvedValue({ language: 'pl', bundle: ['q1'], ipipBundle: [1], lastQuestion: null });
  mocked(model.getQuestionTranslation).mockResolvedValue({ qT: 'translated', factT: 'fact' });
  mocked(model.getCurrentQuestionnaire).mockResolvedValue([]);
  expect(await getNextQuestion(null, {}, context)).toMatchObject({ question: 'translated' });
  expect(model.getQuestionTranslation).toHaveBeenCalledWith('q1', 'pl', context);
  await getQuestionnaire(null, {}, context);
  expect(model.getCurrentQuestionnaire).toHaveBeenCalledWith(undefined, [1], 'pl', 'user', context);
});

test.each([null, { id: 'user', role: 'player' }])('all import endpoints reject non-admin accounts: %p', async user => {
  mocked(findAdmin).mockResolvedValue(user);
  await expect(importTranslations(null, { lang: 'pl' }, context)).rejects.toThrow('Administrator');
  await expect(importQuestions(null, {}, context)).rejects.toThrow('Administrator');
  await expect(getTranslationImportLanguages(null, {}, context)).rejects.toThrow('Administrator');
  expect(getTranslationSheets).not.toHaveBeenCalled();
});

test('import reports database failure and success counts accurately', async () => {
  mocked(getTranslationSheets).mockResolvedValue(['en', 'pl']);
  mocked(getTranslationBatch).mockResolvedValue([{ qIdInSheet: '1', qT: 'Question' }]);
  mocked(upsertQuestionTranslations).mockRejectedValueOnce(new Error('Write failed'));
  expect(await importTranslations(null, { lang: 'pl' }, context)).toEqual({ success: false, inserted: 0, updated: 0, errors: ['Write failed'] });
  mocked(upsertQuestionTranslations).mockResolvedValueOnce({ inserted: 2, updated: 1 });
  expect(await importTranslations(null, { lang: 'pl' }, context)).toEqual({ success: true, inserted: 2, updated: 1, errors: [] });
});

test('sheet failures remain visible instead of becoming successful empty imports', async () => {
  mocked(getTranslationSheets).mockRejectedValue(new Error('Sheet unavailable'));
  expect(await getTranslationImportLanguages(null, {}, context)).toEqual({ languages: [], errors: ['Sheet unavailable'] });
  expect(await importTranslations(null, { lang: 'pl' }, context)).toMatchObject({ success: false, errors: ['Sheet unavailable'] });
  expect(upsertQuestionTranslations).not.toHaveBeenCalled();
});

test('parsing tolerates missing optional cells but rejects malformed and duplicate rows', () => {
  const header = ['ID', 'Question', 'Fact', 'Unit'];
  expect(parseTranslations([header, ['1', ' Question ']], 'pl')).toEqual([
    { qIdInSheet: '1', lang: 'pl', qT: 'Question', factT: '', unitT: '' },
  ]);
  expect(() => parseTranslations([header, ['1']], 'pl')).toThrow('Row 2');
  expect(() => parseTranslations([header, ['1', 'Q'], ['1', 'Q']], 'pl')).toThrow('duplicate');
  expect(() => parseTranslations([header], 'pl')).toThrow('no translations');
});
