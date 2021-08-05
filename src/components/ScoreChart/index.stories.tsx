import React from 'react';
import { ScoreChart } from './';

export default { title: 'component/ScoreChart', component: ScoreChart };
export const Default = () => (
  <ScoreChart
    correctAnswer={18.29}
    currentTip={10}
  />
);

export const Close = () => (
  <ScoreChart
    correctAnswer={18.29}
    currentTip={18}
  />
);

export const Zero = () => (
  <ScoreChart
    correctAnswer={18.29}
    currentTip={5}
  />
);

Default.storyName = 'Default chart';
Close.storyName = 'Close to correct chart';
Zero.storyName = 'Zero points chart';
