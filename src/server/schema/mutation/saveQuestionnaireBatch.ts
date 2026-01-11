import { ValidationError } from 'yup';
import {
  updateLastIpipQuestion,
  upsertQuestionnaireAnswers,
} from '../../model';
import { GraphQLContext } from '../context';

export async function saveQuestionnaireBatch(
  parent: any,
  {
    items,
  }: {
    items: Array<{
      questionId: number;
      value: number;
    }>;
  },
  context: GraphQLContext
) {
  const { user } = context;

  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  const { error } = await upsertQuestionnaireAnswers(items, user.id, context);

  if (!error) {
    await updateLastIpipQuestion(
      user.id,
      items[items.length - 1].questionId,
      context
    );
  }

  return 'ok';
}
