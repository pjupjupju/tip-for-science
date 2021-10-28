import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Flex } from 'rebass';
import { useMutation, useQuery } from '@apollo/client';
import './index.css';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { Play } from './pages/Play';
import { Stats } from './pages/Stats';
import { SignIn } from './pages/SignIn';
import { AuthQueryName, AUTH_QUERY, SIGN_OUT_MUTATION } from './gql';
import { Spinner } from './components';
import { SignUp } from './pages/SignUp';

export const App = () => {
  const { loading, data } = useQuery(AUTH_QUERY);
  const [signOut] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [AuthQueryName],
    onCompleted: ({ signOut: { __typename, ...data } }) => {
      console.log(data);
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
        <Spinner />
      </Flex>
    );
  }

  return (
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
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
    </Switch>
  );
};
