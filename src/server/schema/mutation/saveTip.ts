import { ulid } from 'ulid';
import { getScore } from '../../../helpers';
import {
  createQuestionTip,
  getQuestionWithRun,
  updateScore,
} from '../../model';
import { GraphQLContext } from '../context';

export async function saveTip(
  parent: any,
  {
    id,
    tip,
    rId,
    gId,
    previousTips,
    knewAnswer,
    answered,
    msElapsed,
  }: {
    id: string;
    tip: number;
    rId: number;
    gId: number;
    previousTips: number[];
    knewAnswer: boolean;
    answered: boolean;
    msElapsed: number;
  },
  context: GraphQLContext
) {
  const { dynamo, user } = context;

  const question = await getQuestionWithRun(id, rId, context);

  const { strategy, settings, runId } = question;
  const tipId = ulid();

  await createQuestionTip(
    {
      tipId,
      id,
      tip,
      runId, // UUID
      correctAnswer: settings.correctAnswer,
      strategy: {
        maxGenerations: strategy.maxGenerations,
        numTipsToShow: strategy.numTipsToShow,
        selectionPressure: strategy.selectionPressure,
        tipsPerGeneration: strategy.tipsPerGeneration,
      },
      generation: gId,
      previousTips,
      timeLimit: settings.timeLimit,
      knewAnswer,
      answered,
      msElapsed,
      userId: user.id,
    },
    context
  );

  const questionScore = getScore(tip, settings.correctAnswer);

  await updateScore(user.id, questionScore, { questionId: id, tipId }, context);

  return 'ok';
}
