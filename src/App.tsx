import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import theme from '@rebass/preset';
import './index.css';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { Play } from './pages/Play';

export const tipForScienceTheme = {
  ...theme,
  radii: { default: 0 },
  colors: { background: 'black', primary: '#FF0070', secondary: '#5CC9FA' },
  fonts: {
    body: 'Tahoma',
    ...(theme as any).fonts,
  },
};

export const App = () => (
  <ThemeProvider theme={tipForScienceTheme}>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/play">
          <Play />
        </Route>
      </Switch>
  </ThemeProvider>
);
