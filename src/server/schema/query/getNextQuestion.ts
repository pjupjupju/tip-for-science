import { ValidationError } from 'yup';
import { GraphQLContext } from '..';
import {
  findUserById,
  getEnabledQuestionRuns,
  updateLastQuestion,
  getCurrentGenerationTips,
} from '../../model';

type Question = {
  id: string;
  rId: number;
  gId: number;
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

  const runItem =
    nextQuestionRuns.find((r: any) => r.run === runRecord.run.toString()) ||
    nextQuestionRuns[0];

  const tips = await getCurrentGenerationTips(
    nextQuestionId,
    Number(runItem.run),
    runItem.generation,
    {
      dynamo,
    }
  );

  console.log('tips in this gen: ', JSON.stringify(tips));

  // await updateLastQuestion(user.id, nextQuestionId, { dynamo });

  return {
    id: runItem.id,
    gId: runItem.generation,
    rId: runItem.run,
    question: runItem.settings.question,
    image: runItem.settings.image,
    previousTips: runItem.previousTips,
    correctAnswer: runItem.settings.correctAnswer,
    timeLimit: runItem.settings.timeLimit,
    unit: runItem.settings.unit,
  };
}
