import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Stats } from './Stats';
import { Settings } from './Settings';
import { Container } from '../../components';
import { User } from '../../types';
import Helmet from 'react-helmet';

const topBarStyles = { backgroundColor: 'dimmed.main' };
const linkStyles = {
  color: '#fff',
  fontWeight: 700,
  fontSize: 14,
  padding: '8px',
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
};

const NavbarLink = ({
  children,
  ...rest
}: {
  children: ReactNode;
  to: string;
}) => (
  <Link sx={linkStyles} component={RouterLink} {...rest}>
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
        <Typography p={1} fontWeight="bold">
          <FormattedMessage
            id="app.stats.menu.profile"
            defaultMessage="Profile"
            description="Profile text"
          />
        </Typography>
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
        <NavbarLink to="/">
          <FormattedMessage
            id="app.stats.menu.home"
            defaultMessage="Home"
            description="Home link"
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
