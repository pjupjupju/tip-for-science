import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import { tipForScienceTheme } from '../src/theme';
import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'tips',
    values: [
      {
        name: 'tips',
        value: '#000',
      },
    ],
  },
  layout: 'fullscreen',
};

const wrapper = (storyFn) => (
  <MemoryRouter>
    <ThemeProvider theme={tipForScienceTheme}>{storyFn()}</ThemeProvider>
  </MemoryRouter>
);

export const decorators = [wrapper];
