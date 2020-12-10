import React from 'react';
import { Game } from './../../components';
import washington from './../../assets/game_washington.jpg';

const Play = () => (
  <Game
    settings={{
      question: 'Jak velkou má tadydlencten pán hlavu?',
      image: washington,
      previousTips: [10, 32],
      correctAnswer: 18.29,
      timeLimit: 10,
      unit: "m"
    }}
    onSubmit={() => {console.log("cum sum!")}}
    onFinish={() => {console.log("odišiel som")}}
  />
);

export { Play };
