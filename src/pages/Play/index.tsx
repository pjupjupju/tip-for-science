import React from 'react';
import { Game } from './../../components';
import washington from './../../assets/slide1_washington.jpg';

const Play = () => (
  <Game
    settings={{
      question: 'Jak velký je fleeb?',
      image: washington,
      previousTips: [99, 468],
      correctAnswer: 161,
      timeLimit: 10,
      unit: "m"
    }}
    onSubmit={() => {}}
    onFinish={() => {}}
  />
);

export { Play };
