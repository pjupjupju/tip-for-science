import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { muiTheme } from '../src/theme';
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
    <ThemeProvider theme={muiTheme}>{storyFn()}</ThemeProvider>
  </MemoryRouter>
);

export const decorators = [wrapper];
