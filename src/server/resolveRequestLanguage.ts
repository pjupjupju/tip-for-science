import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { AUTH_QUERY } from '../gql/authQuery';
import { getUserLanguage } from '../language';
import { detectLanguage } from './io/detectLanguage';
import { getLanguageCookie, setLanguageCookie } from './io/languageCookie';
import { GraphQLContext } from './schema/context';

export async function resolveRequestLanguage(
  client: ApolloClient<NormalizedCacheObject>,
  { request, response }: GraphQLContext
): Promise<string> {
  // Populate the same cache used by LanguageProvider and App during SSR.
  const { data } = await client.query({ query: AUTH_QUERY });
  const user = data.viewer.user;
  const cookieLanguage = getLanguageCookie(request.headers.cookie);
  const language = user
    ? getUserLanguage(user.language)
    : (await detectLanguage(request.ip, cookieLanguage)).language;

  if (cookieLanguage !== language) {
    setLanguageCookie(response, language);
  }

  return language;
}
