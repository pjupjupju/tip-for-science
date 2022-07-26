import { DynamoDB } from 'aws-sdk';
import { exportTipData } from '../../model';
import { User } from '../../model/types';

export async function exportData(
  parent: any,
  _: any,
  { dynamo, user }: { dynamo: DynamoDB.DocumentClient; user: User }
) {
  const downloadUrl = await exportTipData({ dynamo });

  return downloadUrl;
}
