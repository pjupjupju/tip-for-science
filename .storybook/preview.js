import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from "emotion-theming";
import { tipForScienceTheme } from '../src/App';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

const wrapper = storyFn => (
    <MemoryRouter>
      <ThemeProvider theme={tipForScienceTheme}>
        {storyFn()}
        </ThemeProvider>
    </MemoryRouter>
);

export const decorators = [wrapper];
