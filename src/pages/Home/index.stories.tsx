import { action } from '@storybook/addon-actions';
import React from 'react';
import { Home } from './';

export default { title: 'pages/Home', component: Home };
export const Default = () => <Home onLogOut={action('logout')} isSignedIn />;

export const Guest = () => (
  <Home onLogOut={action('logout')} isSignedIn={false} />
);

Default.storyName = 'Signed user homescreen';
Guest.storyName = 'Guest user homescreen';
