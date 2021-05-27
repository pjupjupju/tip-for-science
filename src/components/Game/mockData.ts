import washington from './../../assets/game_washington.jpg';

const mockData = [
  {
    id: 'washingtonData',
    data: [
      { x: 0, y: 0 },
      { x: 12, y: 0.5 },
      { x: 15, y: 0.7 },
      { x: 18, y: 0.94 },
      { x: 19, y: 0.9 },
      { x: 25, y: 0.5 },
      { x: 42, y: 0 },
    ],
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
