import { ValidationError } from 'yup';
import { findUserById } from '../model/user';
import { UserRole } from '../model/types';
import { GraphQLContext } from './context';

export async function requireAdmin(context: GraphQLContext) {
  const user = context.user && (await findUserById(context.user.id, context));
  if (!user || user.role !== UserRole.admin) {
    throw new ValidationError('Administrator access required.');
  }
}
