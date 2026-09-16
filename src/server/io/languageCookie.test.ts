import { getLanguageCookie, setLanguageCookie } from './languageCookie';

test('language cookies are decoded and invalid values ignored', () => {
  expect(getLanguageCookie('session=abc; tfs_language=pl; other=1')).toBe('pl');
  expect(getLanguageCookie('tfs_language=en%2DGB')).toBe('en-GB');
  expect(getLanguageCookie('tfs_language=%')).toBeUndefined();
  expect(getLanguageCookie('tfs_language=not a locale')).toBeUndefined();
  expect(getLanguageCookie('tfs_language=')).toBeUndefined();
  expect(getLanguageCookie()).toBeUndefined();
});

test('language persistence uses an HttpOnly cookie with a one-year lifetime', () => {
  const response = { cookie: jest.fn() };
  setLanguageCookie(response as any, 'pl');
  expect(response.cookie).toHaveBeenCalledWith('tfs_language', 'pl', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });
});
