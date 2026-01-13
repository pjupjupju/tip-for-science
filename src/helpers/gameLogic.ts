import { User } from '../types';

const getScore = (currentTip: number, correctAnswer: number): number => {
  if (currentTip < 0.5 * correctAnswer || currentTip > 2 * correctAnswer) {
    return 0;
  }
  if (currentTip === correctAnswer) {
    return 100;
  }
  if (currentTip > correctAnswer) {
    return ((2 * correctAnswer - currentTip) / correctAnswer) * 100;
  }
  return (
    (1 - Math.pow((currentTip - correctAnswer) / (correctAnswer / 2), 2)) * 100
  );
};

export { getScore };
