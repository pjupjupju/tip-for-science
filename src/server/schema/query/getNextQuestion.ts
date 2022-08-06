import { ValidationError } from 'yup';
import { GraphQLContext } from '..';
import {
  findUserById,
  getEnabledQuestionRuns,
  updateLastQuestion,
} from '../../model';

type Question = {
  id: string;
  rId: number;
  gId: number;
  fact: string;
  question: string;
  image?: string;
  previousTips: number[];
  correctAnswer: number;
  timeLimit?: number;
  unit: string;
};

export async function getNextQuestion(
  parent: any,
  _: {},
  { dynamo, runCache, user }: GraphQLContext
): Promise<Question | null> {
  if (user == null) {
    throw new ValidationError('Unauthorized.');
  }
  const userRecord = await findUserById(user.id, { dynamo });

  if (userRecord == null) {
    throw new ValidationError('User does not exist.');
  }

  if (userRecord.bundle.length === 0) {
    return null;
  }

  const lastQuestion = userRecord.lastQuestion;

  // if this is the last question in whole bundle, ie. user has completed everything
  if (
    lastQuestion &&
    userRecord.bundle.indexOf(lastQuestion) === userRecord.bundle.length - 1
  ) {
    return null;
  }

  // if user has lastQuestion === null, give him the first question, otherwise select next
  const nextQuestionId = lastQuestion
    ? userRecord.bundle[userRecord.bundle.indexOf(lastQuestion) + 1]
    : userRecord.bundle[0];

  const nextQuestionRuns = await getEnabledQuestionRuns(nextQuestionId, {
    dynamo,
  });

  // get the preferred run from cache
  const runRecord = await runCache.getRunId(nextQuestionId, nextQuestionRuns);

  await updateLastQuestion(user.id, nextQuestionId, { dynamo });

  return {
    id: runRecord.id,
    gId: runRecord.generation,
    rId: runRecord.run,
    fact: runRecord.settings.fact,
    question: runRecord.settings.question,
    image: runRecord.settings.image,
    previousTips: runRecord.previousTips,
    correctAnswer: runRecord.settings.correctAnswer,
    timeLimit: runRecord.settings.timeLimit,
    unit: runRecord.settings.unit,
  };
}
