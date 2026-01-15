import { DynamoDB } from 'aws-sdk';
import { ValidationError } from 'yup';
import { exportTipData } from '../../model';
import { User } from '../../model/types';
import { GraphQLContext } from '../context';

export async function exportData(
  parent: any,
  _: any,
  context: GraphQLContext
) {
  const { dynamo, user } = context;

  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  // TODO: check if user is authed and role is admin
  const downloadUrl = await exportTipData(context);

  return downloadUrl;
}
