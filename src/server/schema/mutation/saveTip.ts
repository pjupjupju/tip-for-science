import { DynamoDB } from 'aws-sdk';
import { ulid } from 'ulid';
import { getScore } from '../../../helpers';
import { RunLock } from '../../io';
import { createQuestionTip, getQuestion, updateScore } from '../../model';
import { User } from '../../model/types';

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
  {
    dynamo,
    user,
    runLock,
  }: { dynamo: DynamoDB.DocumentClient; user: User; runLock: RunLock }
) {
  const question = await getQuestion(id, { dynamo });
  const { strategy, settings } = question;

  const runIndex = rId - 1;

  const tipId = ulid();

  await createQuestionTip(
    {
      tipId,
      id,
      tip,
      run: rId,
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
    { dynamo, runLock }
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
