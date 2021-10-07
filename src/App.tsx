import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import theme from '@rebass/preset';
import './index.css';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { Play } from './pages/Play';
import { Stats } from './pages/Stats';
import { Signup } from './pages/Signup';
import { UserContext } from './userContext';
import { getItem, removeItem } from './io';

export const tipForScienceTheme = {
  ...theme,
  radii: { default: 0 },
  colors: { background: 'black', primary: '#FF0070', secondary: '#5CC9FA' },
  fonts: {
    body: 'Tahoma',
    ...(theme as any).fonts,
  },
};

export const App = () => {
  const [user, setUser] = useState<string | null>(null);
  const handleLogOut = () => {
    removeItem('user');
    setUser(null);
  };
  useEffect(() => {
    const userFromStorage = getItem('user');
    if (userFromStorage) {
      setUser(userFromStorage);
      console.log('user: ', userFromStorage);
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeProvider theme={tipForScienceTheme}>
        <Switch>
          <Route path="/" exact>
            <Home isSignedIn={user != null} onLogOut={handleLogOut} />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/play">
            <Play />
          </Route>
          <Route path="/stats">
            <Stats />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
        </Switch>
      </ThemeProvider>
    </UserContext.Provider>
  );
};
