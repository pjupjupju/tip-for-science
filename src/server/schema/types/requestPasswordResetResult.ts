import { IResolverObject } from 'graphql-tools';
import * as yup from 'yup';
import { GraphQLContext } from '../context';

export type RequestPasswordResetResultSource =
  | { type: 'RequestPasswordResetSuccess'; result: true }
  | { type: 'ValidationError'; error: yup.ValidationError };

export const RequestPasswordResetResult: IResolverObject<
  RequestPasswordResetResultSource,
  GraphQLContext
> = {
  __resolveType(source) {
    return source.type;
  },
};
