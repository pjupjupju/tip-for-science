import { ExpressContext } from 'apollo-server-express';
import { DynamoDB } from 'aws-sdk';
import { Request } from 'express';


export interface GraphQLContext {
  dynamo: DynamoDB.DocumentClient;
  request: Request;
}

interface ContextOptions {
  dynamo: DynamoDB.DocumentClient;
}

export function createContext({
  dynamo,
}: ContextOptions): (apolloContext: ExpressContext) => GraphQLContext {
  return apolloContext => ({
      dynamo,
      request: apolloContext.req,
    });
  ;
}