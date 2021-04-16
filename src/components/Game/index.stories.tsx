import React from 'react';
import { action } from '@storybook/addon-actions';
import { Game } from './';
import { question } from './mockData';

export default { title: 'component/Game', component: Game };
export const Default = () => (
  <Game
    settings={question}
    onSubmit={action('submit-value')}
    onFinish={action('finish')}
    isSubmitted={false}
  />
);

export const Submitted = () => (
  <Game
    settings={question}
    onSubmit={action('submit-value')}
    onFinish={action('finish')}
    isSubmitted={true}
  />
);

Default.storyName = 'Default Game state';
Submitted.storyName = 'Submitted Game state';

