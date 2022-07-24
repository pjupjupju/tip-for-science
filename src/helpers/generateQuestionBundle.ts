export function generateQuestionBundle(
  initialQuestionIds: string[],
  restAvailableQuestionIds: string[]
): string[] {
  const intitialBundle = initialQuestionIds.sort(() => Math.random() - 0.5);
  const restBundle = restAvailableQuestionIds.sort(() => Math.random() - 0.5);

  return [...intitialBundle, ...restBundle];
}
