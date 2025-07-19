import { ulid } from 'ulid';
import { getScore } from '../../../helpers';
import { createQuestionTipV2, getQuestionWithRun, updateScore } from '../../model';
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
  const runIndex = rId - 1;
  const tipId = ulid();

  await createQuestionTipV2(
    {
      tipId,
      id,
      tip,
      runId, // UUID
      correctAnswer: settings.correctAnswer,
      strategy: {
        numTipsToShow:
          strategy.numTipsToShow[runIndex % strategy.numTipsToShow.length],
        selectionPressure:
          strategy.selectionPressure[
            runIndex % strategy.selectionPressure.length
          ],
        tipsPerGeneration:
          strategy.tipsPerGeneration[
            runIndex % strategy.tipsPerGeneration.length
          ],
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

  await updateScore(
    user.id,
    questionScore,
    { questionId: id, tipId },
    { dynamo }
  );

  return 'ok';
}
