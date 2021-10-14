import { IResolverObject } from 'graphql-tools';
import * as yup from 'yup';
import { GraphQLContext } from '../context';

export type SignUpResultSource =
  | { type: 'SignInSuccess'; viewer: {} }
  | { type: 'ValidationError'; error: yup.ValidationError };

export const SignUpResult: IResolverObject<
  SignUpResultSource,
  GraphQLContext
> = {
  __resolveType(source) {
    return source.type;
  },
};
