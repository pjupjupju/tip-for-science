import { DynamoDB } from 'aws-sdk';
import { ValidationError } from 'yup';
import { exportTipData } from '../../model';
import { User } from '../../model/types';

export async function exportData(
  parent: any,
  _: any,
  { dynamo, user }: { dynamo: DynamoDB.DocumentClient; user: User }
) {
  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  // TODO: check if user is authed and role is admin
  const downloadUrl = await exportTipData({ dynamo });

  return downloadUrl;
}
