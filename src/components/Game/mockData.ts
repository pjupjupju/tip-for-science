import washington from './../../assets/game_washington.jpg';

const mockData = [
  {
    id: 'exp',
    data: [0.5, 1].map((y, i) => ({
      x: `#${i}`,
      y,
    })),
  },
  {
    curve: 'linear',
    id: 'lin',
    data: [0, 1].map((y, i) => ({ x: `#${i}`, y })),
  },
];

const question = {
  question: 'Jak velkou má tadydlencten pán hlavu?',
  image: washington,
  previousTips: [10, 32],
  correctAnswer: 18.29,
  unit: 'm',
};

export { mockData, question };
