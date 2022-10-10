import { ValidationError } from 'yup';
import { batchSlugifyUsers, findUserById } from '../../model';
import { GraphQLContext } from '../context';

export async function batchSlugify(
  parent: any,
  _: any,
  { dynamo, user }: GraphQLContext
) {
  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  const userRecord = await findUserById(user.id, { dynamo });
  // only allow user who is admin, so first load user role
  if (userRecord.role !== 'admin') {
    throw new ValidationError('Unauthorized.');
  }

  await batchSlugifyUsers({ dynamo });

  return 'ok';
}
