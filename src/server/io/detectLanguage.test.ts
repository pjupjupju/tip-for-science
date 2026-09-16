/** @jest-environment node */
import { detectLanguage } from './detectLanguage';

const originalFetch = global.fetch;
const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock;
});
afterEach(() => { global.fetch = originalFetch; });

test('IP suggestion takes precedence over the stored cookie fallback', async () => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ country: 'CZ' }) });
  expect(await detectLanguage('127.0.0.1', 'pl')).toEqual({ country: 'CZ', language: 'cs' });
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('failed lookup falls back to the stored language or English', async () => {
  fetchMock.mockRejectedValue(new Error('Unavailable'));
  expect(await detectLanguage('127.0.0.1', 'pl')).toEqual({ country: 'N/A', language: 'pl' });
  expect(await detectLanguage('127.0.0.1')).toEqual({ country: 'N/A', language: 'en' });
});
