export function generateQuestionBundle<T>(
  initialQuestionIds: T[],
  restAvailableQuestionIds: T[]
): T[] {
  const intitialBundle = initialQuestionIds.sort(() => Math.random() - 0.5);
  const restBundle = restAvailableQuestionIds.sort(() => Math.random() - 0.5);

  return [...intitialBundle, ...restBundle];
}
