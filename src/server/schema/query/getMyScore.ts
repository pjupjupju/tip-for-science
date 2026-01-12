import { DynamoDB } from 'aws-sdk';
import { ValidationError } from 'yup';
import { findUserById } from '../../model';
import { User } from '../../model/types';
import { GraphQLContext } from '../context';

export async function getMyScore(parent: any, _: {}, context: GraphQLContext) {
  const { dynamo, user } = context;

  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  const userRecord = await findUserById(user.id, context);

  if (userRecord == null) {
    throw new ValidationError('User does not exist.');
  }

  return userRecord.score.toFixed(2);
}
