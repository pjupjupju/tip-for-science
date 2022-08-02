import { DynamoDB } from 'aws-sdk';
import { ValidationError } from 'yup';
import { getHighScorePlayers } from '../../model';
import { User } from '../../model/types';

export async function getHighScore(
  parent: any,
  _: {},
  { dynamo, user }: { dynamo: DynamoDB.DocumentClient; user: User }
) {
  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  const highScore = await getHighScorePlayers(dynamo);

  return highScore;
}
