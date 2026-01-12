import { ValidationError } from 'yup';
import { GraphQLContext } from '..';
import {
  Questionnaire,
  findUserById,
  getCurrentQuestionnaire,
} from '../../model';

export async function getQuestionnaire(
  parent: any,
  _: {},
  context: GraphQLContext
): Promise<Questionnaire[]> {
  const { dynamo, user } = context;

  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  const userRecord = await findUserById(user.id, context);

  if (userRecord == null) {
    throw new ValidationError('User does not exist.');
  }

  if (userRecord.ipipBundle.length === 0) {
    return [];
  }

  const language = user.language || 'cs'; // use DEFAULT_LANGUAGE later
  const lastIpipQuestion = userRecord.lastIpipQuestion;

  // if this is the last question in whole IPIP bundle, ie. user has completed everything
  if (
    lastIpipQuestion &&
    userRecord.ipipBundle.indexOf(lastIpipQuestion) ===
      userRecord.ipipBundle.length - 1
  ) {
    return [];
  }

  const questionnaire = await getCurrentQuestionnaire(
    lastIpipQuestion,
    userRecord.ipipBundle,
    language,
    user.id,
    context
  );

  return questionnaire;
}
