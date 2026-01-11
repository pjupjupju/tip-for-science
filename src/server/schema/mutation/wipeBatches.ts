import { ValidationError } from 'yup';
import { wipeAllBatches } from '../../model';
import { GraphQLContext } from '../context';

export async function wipeBatches(
  parent: any,
  _: any,
  context: GraphQLContext
) {
  const { user } = context;

  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  await wipeAllBatches(context);

  return true;
}
