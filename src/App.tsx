import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { useMutation, useQuery } from '@apollo/client';
import Helmet from 'react-helmet';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import './index.css';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { Play } from './pages/Play';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { Consent } from './pages/Consent';
import { Ipip } from './pages/Ipip';
import { AuthQueryName, AUTH_QUERY, SIGN_OUT_MUTATION } from './gql';
import { Spinner } from './components';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { Page404 } from './pages/Page404';
import { muiTheme, resetStyles } from './theme';

const AppLayout = () => {
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
      <Stack
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
        p={3}
      >
        <Helmet titleTemplate="Loading..."></Helmet>
        <Spinner />
      </Stack>
    );
  }

  return (
    <>
      <Helmet titleTemplate="%s | TipForScience.org"></Helmet>
      <Routes>
        <Route
          path="/"
          element={<Home user={user} onLogOut={handleLogOut} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/play" element={<Play user={user} />} />
        <Route path="/profile/*" element={<Profile user={user} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/consent" element={<Consent />} />
        {user && user.role === 'admin' && (
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        )}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
};

const globalStyles = <GlobalStyles styles={resetStyles} />;

export const App = () => (
  <MuiThemeProvider theme={muiTheme}>
    {globalStyles}
    <AppLayout />
  </MuiThemeProvider>
);
