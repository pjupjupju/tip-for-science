import { DynamoDB } from 'aws-sdk';
import { ValidationError } from 'yup';
import { findUserById } from '../../model';
import { User } from '../../model/types';
// import { TABLE_QUESTION, TABLE_TIP } from './../../../config';

export async function getMyScore(
  parent: any,
  _: {},
  { dynamo, user }: { dynamo: DynamoDB.DocumentClient; user: User }
) {
  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  const userRecord = await findUserById(user.id, { dynamo });

  if (userRecord == null) {
    throw new ValidationError('User does not exist.');
  }

  return userRecord.score.toFixed(2);
}
