import { RunStrategy } from '../server/model';

// Using Partial Fisher-Yates Shuffle
export function selectPreviousTipsToDisplay(
  survivorTips: number[],
  strategy: RunStrategy
) {
  const result = [...survivorTips];
  const count = strategy.numTipsToShow;

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * (result.length - i)) + i;
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }

  return result.slice(0, count);
}
