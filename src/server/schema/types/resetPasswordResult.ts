import { IResolverObject } from 'graphql-tools';
import * as yup from 'yup';
import { GraphQLContext } from '../context';

export type ResetPasswordResultSource =
  | { type: 'ResetPasswordSuccess'; result: true }
  | { type: 'ValidationError'; error: yup.ValidationError };

export const ResetPasswordResult: IResolverObject<
  ResetPasswordResultSource,
  GraphQLContext
> = {
  __resolveType(source) {
    return source.type;
  },
};
