import { DynamoDB } from 'aws-sdk';
import { Cookie } from 'express-session';
import { DynamoSessionStore } from './DynamoSessionStore';

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(Date.UTC(2026, 8, 17));
});

afterEach(() => jest.restoreAllMocks());

test.each([false, true])('a reloaded session can save a language change (legacy: %s)', async (legacy) => {
  const sessionCookie = new Cookie();
  sessionCookie.maxAge = 90 * 86400000;
  sessionCookie.secure = true;
  const original = {
    cookie: sessionCookie,
    token: 'old-token',
  };
  const expires = Math.floor(original.cookie.expires.getTime() / 1000);
  let stored: DynamoDB.AttributeMap;
  const dynamo = {
    put: jest.fn(({ Item }) => ({
      promise: async () => {
        if (!Number.isFinite(Item.expires)) throw new Error('Invalid expiration');
        stored = DynamoDB.Converter.marshall(Item);
      },
    })),
    get: jest.fn(() => ({
      promise: async () => ({ Item: DynamoDB.Converter.unmarshall(stored) }),
    })),
  };
  const store = new DynamoSessionStore({
    dynamo: dynamo as unknown as DynamoDB.DocumentClient,
    tableName: 'sessions',
  });

  if (legacy) {
    stored = DynamoDB.Converter.marshall({ id: 'session', expires, data: original });
  } else {
    const callback = jest.fn();
    await store.set('session', original, callback);
    expect(callback).toHaveBeenCalledWith();
    const saved = DynamoDB.Converter.unmarshall(stored);
    expect(saved.data.cookie.expires).toBe(original.cookie.expires.toISOString());
  }

  // DynamoDB maps are unordered; restoring a cookie must not depend on key order.
  const cookie = stored.data.M.cookie.M;
  stored.data.M.cookie.M = Object.fromEntries(Object.entries(cookie).reverse());
  const request: any = { sessionID: 'session', sessionStore: store };
  await new Promise<void>((resolve, reject) => {
    store.get('session', (error, data) => {
      if (error) return reject(error);
      store.createSession(request, data);
      resolve();
    });
  });

  expect(Math.floor(request.session.cookie.expires.getTime() / 1000)).toBe(expires);
  request.session.token = 'new-language-token';
  await new Promise<void>((resolve, reject) => {
    request.session.save((error) => error ? reject(error) : resolve());
  });
  const saved = DynamoDB.Converter.unmarshall(stored);
  expect(saved.data.token).toBe('new-language-token');
  expect(saved.expires).toBe(expires);
  expect(typeof saved.data.cookie.expires).toBe('string');
});
