import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Flex } from 'rebass';
import { useMutation, useQuery } from '@apollo/client';
import './index.css';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { Play } from './pages/Play';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { Consent } from './pages/Consent';
import { AuthQueryName, AUTH_QUERY, SIGN_OUT_MUTATION } from './gql';
import { Spinner } from './components';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { Page404 } from './pages/Page404';
import Helmet from 'react-helmet';

export const App = () => {
  const { loading, data } = useQuery(AUTH_QUERY);
  const [signOut] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [AuthQueryName],
    onCompleted: ({ signOut: { __typename, ...data } }) => {
      // console.log(data);
    },
  });

  const user = data ? data.viewer.user : null;
  const handleLogOut = () => {
    signOut();
  };

  if (loading) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
        p="3"
      >
        <Helmet titleTemplate="Loading..."></Helmet>
        <Spinner />
      </Flex>
    );
  }

  return (
    <>
      <Helmet titleTemplate="%s | TipForScience.org"></Helmet>
      <Switch>
        <Route path="/" exact>
          <Home user={user} onLogOut={handleLogOut} />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/play">
          <Play user={user} />
        </Route>
        <Route path="/profile">
          <Profile user={user} />
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/consent">
          <Consent />
        </Route>
        {user && user.role === 'admin' && (
          <Route path="/dashboard">
            <Dashboard user={user} />
          </Route>
        )}
        <Route path="*">
          <Page404 />
        </Route>
      </Switch>
    </>
  );
};
