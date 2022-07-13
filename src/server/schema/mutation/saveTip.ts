import { DynamoDB } from 'aws-sdk';
// import { ulid } from 'ulid';
import { getScore } from '../../../helpers';
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
    msElapsed,
  }: {
    id: string;
    tip: number;
    rId: number;
    gId: number;
    previousTips: number[];
    knewAnswer: boolean;
    msElapsed: number;
  },
  { dynamo, user }: { dynamo: DynamoDB.DocumentClient; user: User }
) {
  console.log(`--- updating Question ${id} with tip ${tip}`);

  const question = await getQuestion(id, { dynamo });
  const { strategy, settings } = question;
  console.log('strategia Oi!: ', strategy);
  const runIndex = rId - 1;

  await createQuestionTip(
    {
      id,
      tip,
      run: rId,
      correctAnswer: settings.correctAnswer,
      strategy: {
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
      knewAnswer,
      msElapsed,
      userId: user.id,
    },
    { dynamo }
  );

  const questionScore = getScore(tip, settings.correctAnswer);

  await updateScore(user.id, questionScore, { dynamo });

  //
  /*s
  Update user question progress

  await dynamo.put({
    TableName: TABLE_USER,
    Item: {
      id: "01FGFWT7TPF5G3CEEGQHH7BAGX",
      question_id: id,
      userskey: `TIP#${tipId}`,
      tip,
      created_at: new Date(),
    },
  });
  */

  return 'ok';
}
