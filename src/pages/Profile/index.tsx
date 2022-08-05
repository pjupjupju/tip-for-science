import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Stats } from './Stats';
import { Settings } from './Settings';

const Profile = () => (
  <>
    <Switch>
    <Route path=".">
        <Stats />
      </Route>
      <Route path="/profile/stats">
        <Stats />
      </Route>
      <Route path="/profile/settings">
        <Settings />
      </Route>
      <Redirect from="/" to="/profile/stats"/>
    </Switch>
  </>
);

export { Profile };
