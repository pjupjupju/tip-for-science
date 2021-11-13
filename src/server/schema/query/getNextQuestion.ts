import { GraphQLContext } from '..';
// import { TABLE_QUESTION, TABLE_TIP } from './../../../config';

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
  { id }: { id: string },
  { dynamo, runCache }: GraphQLContext
): Promise<Question> {
  const nextQuestionId = '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfa';

  const rId = runCache.getRunId(nextQuestionId);

  return {
    id: '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfa',
    rId,
    gId: 0,
    question: 'Kolik kilogramů má 100 kilogramů?',
    image:
      'https://cdn.pixabay.com/photo/2013/07/28/12/23/paperclip-168336_1280.jpg',
    previousTips: [50, 105],
    correctAnswer: 100,
    timeLimit: 30,
    unit: 'kg',
  };
}
