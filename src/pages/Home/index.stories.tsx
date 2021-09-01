import React from 'react';
import { Home } from './';

export default { title: 'pages/Home', component: Home };
export const Default = () => <Home isSignedIn />;

export const Guest = () => <Home isSignedIn={false} />;

Default.storyName = 'Signed user homescreen';
Guest.storyName = 'Guest user homescreen';
