import { IResolverObject } from 'graphql-tools';
import * as yup from 'yup';
import { GraphQLContext } from '../context';

export type SignInResultSource =
  | { type: 'SignInSuccess'; viewer: {} }
  | { type: 'ValidationError'; error: yup.ValidationError };

export const SignInResult: IResolverObject<
  SignInResultSource,
  GraphQLContext
> = {
  __resolveType(source) {
    return source.type;
  },
};
