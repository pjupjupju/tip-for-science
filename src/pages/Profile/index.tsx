import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink, Route, Routes, NavLinkProps } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link, { LinkProps } from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import { Stats } from './Stats';
import { Settings } from './Settings';
import { Container } from '../../components';
import { User } from '../../types';
import Helmet from 'react-helmet';

const topBarStyles = { backgroundColor: 'dimmed.main' };
const linkStyles = {
  textDecoration: 'none',

  '&:hover': {
    color: 'primary.main',
    textDecoration: 'none',
  },

  '&:focus': {
    textDecoration: 'none',
  },

  '&:visited': {
    textDecoration: 'none',
  },

  '&.active': {
    color: 'grey.900',
  },
};

const NavbarLink = ({ children, ...rest }: LinkProps & NavLinkProps) => (
  <Link
    sx={linkStyles}
    component={NavLink}
    fontSize={14}
    fontWeight={700}
    color="#fff"
    p="8px"
    {...rest}
  >
    {children}
  </Link>
);

const Profile = ({ user }: { user: User | null }) => (
  <Container noPadding>
    <Helmet title="Profil"></Helmet>
    <Stack direction="column" height="100%">
      <Stack
        direction="row"
        px={1}
        color="white"
        sx={topBarStyles}
        alignItems="center"
      >
        <NavbarLink fontSize={18} to="/">
          {'← '}
          <FormattedMessage
            id="app.stats.menu.home"
            defaultMessage="Home"
            description="Home link"
          />
        </NavbarLink>
        <Box mx="auto" />
        <NavbarLink to="/profile/stats">
          <FormattedMessage
            id="app.stats.menu.stats"
            defaultMessage="Stats"
            description="Stats link"
          />
        </NavbarLink>
        <NavbarLink to="/profile/settings">
          <FormattedMessage
            id="app.stats.menu.settings"
            defaultMessage="Settings"
            description="Settings link"
          />
        </NavbarLink>
      </Stack>
      <Routes>
        <Route index element={<Stats user={user} />} />
        <Route path="stats" element={<Stats user={user} />} />
        <Route path="settings" element={<Settings user={user} />} />
      </Routes>
    </Stack>
  </Container>
);

export { Profile };
