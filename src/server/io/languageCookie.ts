import { Response } from 'express';

const languageCookieName = 'tfs_language';

export function getLanguageCookie(cookieHeader?: string): string | undefined {
  const cookie = cookieHeader?.split(';').find((part) =>
    part.trim().startsWith(`${languageCookieName}=`)
  );
  if (!cookie) {
    return undefined;
  }

  try {
    const language = decodeURIComponent(cookie.trim().slice(languageCookieName.length + 1));
    return Intl.getCanonicalLocales(language)[0];
  } catch {
    return undefined;
  }
}

export function setLanguageCookie(response: Response, language: string) {
  response.cookie(languageCookieName, language, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });
}
