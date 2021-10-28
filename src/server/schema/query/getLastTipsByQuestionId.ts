import { DynamoDB } from 'aws-sdk';
import { findLastTipsByQuestion } from '../../model';

export async function getLastTipsByQuestionId(
  parent: any,
  { questionId, runId }: { questionId: string; runId: string },
  context: { dynamo: DynamoDB.DocumentClient }
) {
  console.log(`--- getting lasttip for Question ${questionId} with run ${runId}`);

  const lastTipsRecord = await findLastTipsByQuestion(
    questionId,
    runId,
    context
  );

  return lastTipsRecord;
}
