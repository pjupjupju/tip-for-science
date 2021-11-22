const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const getScore = (currentTip: number, correctAnswer: number): number => {
  if (currentTip < 0.5 * correctAnswer || currentTip > 2 * correctAnswer) {
    return 0;
  }
  if (currentTip === correctAnswer) {
    return 1;
  }
  if (currentTip > correctAnswer) {
    // console.log('current tip > correct Answer');
    return (2 * correctAnswer - currentTip) / correctAnswer;
  }
  // console.log('posledni');
  return 1 - Math.pow((currentTip - correctAnswer) / (correctAnswer / 2), 2);
};

export { getScore, isServer };
