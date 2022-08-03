import { IResolverObject } from 'graphql-tools';
import { GraphQLContext } from '../context';
import { findUserById } from '../../model';

export const Viewer: IResolverObject<any, GraphQLContext> = {
  id: () => 1,
  user: (source: any, args: any, context) => {
    // context.user is null when signed out, { id: string, iat: number, exp: number } when signed in
    if (context.user == null) {
      return null;
    }

    return findUserById(context.user.id, context);
  },
};
