import React from 'react';
import { Game } from '../../components';
import elephant from './../../assets/slide1_elephant.jpg';
import { SlideProps } from './types';

const Slide9 = (props: SlideProps) => {
  return (
    <Game
      settings={{
        question: 'Kolik vážil největší známý slon?',
        image: elephant,
        correctAnswer: 11000,
        unit: 'kg',
      }}
      onHome={() => {
        console.log('odišiel som domov');
      }}
      onSubmit={() => {
        console.log('cum sum!');
      }}
      onFinish={() => {
        console.log('odišiel som');
      }}
      score={5}
      isSubmitted={false}
    />
  );
};

export { Slide9 };
