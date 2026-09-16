export const DEFAULT_LANGUAGE = 'en';

export const getUserLanguage = (language?: string | null) =>
  language || DEFAULT_LANGUAGE;
