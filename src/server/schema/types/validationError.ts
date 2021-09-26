import * as yup from 'yup';
import { IResolverObject } from 'graphql-tools';
import { GraphQLContext } from '../context';

export const ValidationError: IResolverObject<
  { error: yup.ValidationError },
  GraphQLContext
> = {
  errors: source => {
    if (yup.ValidationError.isError(source.error)) {
      if (source.error.inner.length > 0) {
        return source.error.inner.map(inner => ({
          error: inner.message,
          path: inner.path,
        }));
      }

      return [{ error: source.error.message, path: source.error.path }];
    }

    throw source.error;
  },
};
