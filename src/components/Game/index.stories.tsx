import React from 'react';
import { action } from '@storybook/addon-actions';
import { Game, TooCloseDialog, GameOverScreen } from './';
import { question } from './mockData';

export default { title: 'component/Game', component: Game };
export const Default = () => (
  <Game
    settings={question}
    onHome={action('navigate-home')}
    onSubmit={action('submit-value')}
    onFinish={action('finish')}
    isSubmitted={false}
  />
);

export const Submitted = () => (
  <Game
    settings={question}
    onHome={action('navigate-home')}
    onSubmit={action('submit-value')}
    onFinish={action('finish')}
    isSubmitted={true}
    currentTip={15}
  />
);

export const GameOver = () => (
  <Game settings={question}
  onHome={action('navigate-home')}
  onSubmit={action('submit-value')}
  onFinish={action('finish')}
  isSubmitted={true}
/>
);

export const TooClose = () => (
  <Game settings={question}
  onHome={action('navigate-home')}
  onSubmit={action('submit-value')}
  onFinish={action('finish')}
  isSubmitted={true}
  currentTip={18}
/>
);

export const GameOverScreenStory = () => <GameOverScreen />;

export const TooCloseDialogStory = () => (
  <TooCloseDialog
    onGuessed={action('i-guessed')}
    onKnewIt={action('i-knew-it')}
  />
);

Default.storyName = 'Default Game state';
Submitted.storyName = 'Submitted Game state';
GameOver.storyName = "Game Over state";
TooClose.storyName = "Too close state";
TooCloseDialogStory.storyName = 'Too close dialog';
GameOverScreenStory.storyName = 'Game Over screen';
