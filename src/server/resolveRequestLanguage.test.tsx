/** @jest-environment node */
import React from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Observable,
  useQuery,
} from '@apollo/client';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import { AUTH_QUERY } from '../gql/authQuery';
import { LanguageProvider, useLanguage } from '../LanguageProvider';
import { resolveRequestLanguage } from './resolveRequestLanguage';
import { detectLanguage } from './io/detectLanguage';
import { GraphQLContext } from './schema/context';

jest.mock('./io/detectLanguage', () => ({ detectLanguage: jest.fn() }));
const detect = detectLanguage as jest.Mock;

function createClient(language: string | null) {
  const fetchAccount = jest.fn(() => ({
    __typename: 'Viewer',
    user: language === null ? null : {
      __typename: 'User', id: 'user', email: 'test@example.com', slug: 'test',
      role: 'player', score: 0, createdAt: '2026-01-01', updatedAt: '2026-01-01',
      age: null, gender: null, language, isQuestionnaireActive: false,
      nextQuestionnaireAfterQuestion: null, ipipBundle: [],
    },
  }));
  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new ApolloLink(() => new Observable(observer => {
      observer.next({ data: { viewer: fetchAccount() } });
      observer.complete();
    })),
  });
  return { client, fetchAccount };
}

function createContext(cookie?: string) {
  return {
    request: { ip: '127.0.0.1', headers: { cookie } },
    response: { cookie: jest.fn() },
  } as unknown as GraphQLContext;
}

function AppProbe() {
  const { data } = useQuery(AUTH_QUERY);
  return <span>{useLanguage().language}:{data.viewer.user.id}</span>;
}

beforeEach(() => {
  detect.mockReset();
  detect.mockResolvedValue({ country: 'CZ', language: 'cs' });
});

test('authenticated SSR reuses the prefetched account for both provider and app', async () => {
  const { client, fetchAccount } = createClient('pl');
  const context = createContext('tfs_language=cs');
  try {
    const language = await resolveRequestLanguage(client, context);
    expect(language).toBe('pl');
    expect(detect).not.toHaveBeenCalled();
    expect(context.response.cookie).toHaveBeenCalledWith('tfs_language', 'pl', expect.any(Object));
    const html = await renderToStringWithData(
      <ApolloProvider client={client}>
        <LanguageProvider serverLanguage={language}><AppProbe /></LanguageProvider>
      </ApolloProvider>
    );
    expect(html).toContain('pl');
    expect(html).toContain('user');
    expect(fetchAccount).toHaveBeenCalledTimes(1);
  } finally {
    client.stop();
  }
});

test('guests always run IP detection even with a cookie, on every page request', async () => {
  for (let request = 0; request < 2; request++) {
    const { client } = createClient(null);
    const context = createContext('tfs_language=pl');
    try {
      expect(await resolveRequestLanguage(client, context)).toBe('cs');
      expect(context.response.cookie).toHaveBeenCalledWith('tfs_language', 'cs', expect.any(Object));
    } finally {
      client.stop();
    }
  }
  expect(detect).toHaveBeenCalledTimes(2);
  expect(detect).toHaveBeenCalledWith('127.0.0.1', 'pl');
});

test('matching account cookie needs no rewrite and still skips IP detection', async () => {
  const { client } = createClient('pl');
  const context = createContext('tfs_language=pl');
  try {
    expect(await resolveRequestLanguage(client, context)).toBe('pl');
    expect(context.response.cookie).not.toHaveBeenCalled();
    expect(detect).not.toHaveBeenCalled();
  } finally {
    client.stop();
  }
});
