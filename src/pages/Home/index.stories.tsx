import { action } from '@storybook/addon-actions';
import React from 'react';
import { UserRole } from '../../server/model/types';
import { Home } from './';

const user = { role: UserRole.player };

export default { title: 'pages/Home', component: Home };
export const Default = () => <Home onLogOut={action('logout')} user={user} />;

export const Guest = () => (
  <Home onLogOut={action('logout')} user={null} />
);

Default.storyName = 'Signed user homescreen';
Guest.storyName = 'Guest user homescreen';
