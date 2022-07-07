import { DynamoDB } from 'aws-sdk';
import { findLastTipsByQuestion } from '../../model';

type LastTipsRecord = any;

export async function getLastTipsByQuestionId(
  parent: any,
  { questionId, runId }: { questionId: string; runId: string },
  context: { dynamo: DynamoDB.DocumentClient }
): Promise<LastTipsRecord> {
  console.log(`--- getting previous tips for Question ${questionId} with run ${runId}`);

  const lastTipsRecord = await findLastTipsByQuestion(
    questionId,
    runId,
    context
  );

  return lastTipsRecord;
}
