import { IResolverObject } from 'graphql-tools';
import { GraphQLContext } from '../context';
import { type User as UserType, findUserById } from '../../model';
import { getNextQuestionnaireCursor, isQuestionnaireActive } from '../../io/utils';

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

export const User: IResolverObject<any, GraphQLContext> = {
  isQuestionnaireActive: (userObj: UserType, _args: any, _context) => isQuestionnaireActive(userObj) ?? null,
  nextQuestionnaireAfterQuestion: (userObj: UserType, _args: any, _context) => getNextQuestionnaireCursor(userObj) ?? null,
};
