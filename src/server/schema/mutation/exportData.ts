import { ValidationError } from 'yup';
import { exportTipDataV2 } from '../../model';
import { GraphQLContext } from '../context';

export async function exportData(parent: any, _: any, context: GraphQLContext) {
  const { user } = context;

  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  // TODO: check if user is authed and role is admin
  const downloadUrl = await exportTipDataV2(context);

  return downloadUrl;
}
