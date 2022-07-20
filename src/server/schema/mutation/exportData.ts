import { DynamoDB } from 'aws-sdk';
import { createQuestionTip, getQuestion, updateScore } from '../../model';
import { User } from '../../model/types';

export async function exportData(
  parent: any,
  _: any,
  { dynamo, user }: { dynamo: DynamoDB.DocumentClient; user: User }
) {
  return 'ok';
}
