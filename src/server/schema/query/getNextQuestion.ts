import { ValidationError } from 'yup';
import { GraphQLContext } from '..';
import {
  findUserById,
  getEnabledQuestionRunsV2,
  getQuestionTranslation,
  updateLastQuestion,
} from '../../model';
import { selectPreviousTipsToDisplay } from '../../../helpers/selectPreviousTipsToDisplay';

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
  context: GraphQLContext
): Promise<Question | null> {
  const { dynamo, runCache, user, sql } = context;
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

  const language = user.language || 'cs'; // use DEFAULT_LANGUAGE later
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

  const nextQuestionRuns = await getEnabledQuestionRunsV2(
    nextQuestionId,
    context
  );

  // get the preferred run from cache
  const runRecord = await runCache.getRunV2(nextQuestionId, nextQuestionRuns);

  await updateLastQuestion(user.id, nextQuestionId, { dynamo });

  let translatedData = {
    fact: runRecord.settings.fact,
    unit: runRecord.settings.unit,
    question: runRecord.settings.question,
  };

  if (language !== 'cs') {
    // get translated question
    const translation = await getQuestionTranslation(
      nextQuestionId,
      language,
      context
    );
    translatedData = {
      fact: translation.factT,
      unit: translation.unitT || '',
      question: translation.qT,
    };
  }

  return {
    id: runRecord.id,
    gId: runRecord.generation,
    rId: runRecord.runNum,
    image: runRecord.settings.image,
    previousTips: selectPreviousTipsToDisplay(
      runRecord.previousTips,
      runRecord.strategy
    ),
    correctAnswer: runRecord.settings.correctAnswer,
    timeLimit: runRecord.settings.timeLimit,
    ...translatedData,
  };
}
