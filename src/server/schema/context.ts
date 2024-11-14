import { ExpressContext } from 'apollo-server-express';
import { DynamoDB } from 'aws-sdk';
import { SupabaseClient } from '@supabase/supabase-js';
import { Sql } from 'postgres';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';
import { RunCache, RunLock } from '../io';

export interface UserTokenData {
  /** User ulid */
  id: string;
  language: string;
}

export interface GraphQLContext {
  dynamo: DynamoDB.DocumentClient;
  request: Request;
  runCache: RunCache;
  runLock: RunLock;
  supabase: SupabaseClient;
  sql: Sql;
  user?: UserTokenData;
  language?: string;
}

interface ContextOptions {
  dynamo: DynamoDB.DocumentClient;
  runCache: RunCache;
  runLock: RunLock;
  supabase: SupabaseClient;
  sql: Sql;
}

export function createContext({
  dynamo,
  runCache,
  runLock,
  supabase,
  sql,
}: ContextOptions): (apolloContext: ExpressContext) => Promise<GraphQLContext> {
  return async (apolloContext): Promise<GraphQLContext> => {
    let user: UserTokenData | undefined;

    if (apolloContext.req.session!.token) {
      user = await new Promise((resolve) => {
        verify(
          apolloContext.req.session!.token,
          JWT_SECRET,
          undefined,
          (err, decoded) => {
            if (err) {
              resolve(undefined);
            } else {
              resolve(decoded as unknown as UserTokenData);
            }
          }
        );
      });
    }

    return {
      dynamo,
      supabase,
      sql,
      request: apolloContext.req,
      runCache,
      runLock,
      user,
    };
  };
}
