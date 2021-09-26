import { ExpressContext } from 'apollo-server-express';
import { DynamoDB } from 'aws-sdk';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';


export interface UserTokenData {
  /** User ulid */
  id: string;
}

export interface GraphQLContext {
  dynamo: DynamoDB.DocumentClient;
  request: Request;
  user?: UserTokenData | void;
}

interface ContextOptions {
  dynamo: DynamoDB.DocumentClient;
}

export function createContext({
  dynamo,
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
      request: apolloContext.req,
      user,
    };
  };
}
