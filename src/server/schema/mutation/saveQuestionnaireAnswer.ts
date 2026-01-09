import { ValidationError } from 'yup';
import { upsertQuestionnaireAnswer } from '../../model';
import { GraphQLContext } from '../context';

export async function saveQuestionnaireAnswer(
  parent: any,
  {
    questionId,
    value,
  }: {
    questionId: number;
    value: number;
  },
  context: GraphQLContext
) {
  const { user } = context;

  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }

  await upsertQuestionnaireAnswer(
    {
      questionId,
      value,
      userId: user.id,
    },
    context
  );

  return 'ok';
}
