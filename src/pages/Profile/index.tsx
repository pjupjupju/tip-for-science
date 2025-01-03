import React, { ReactNode } from 'react';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import { Flex, Link, Text, Box } from 'rebass';
import { Stats } from './Stats';
import { Settings } from './Settings';
import { Container } from '../../components';
import { User } from '../../types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

const NavbarLink = ({
  children,
  ...rest
}: {
  children: ReactNode;
  [key: string]: any;
}) => (
  <Link variant="nav" as={RouterLink} {...rest}>
    {children}
  </Link>
);

const Profile = ({ user }: { user: User | null }) => (
  <Container>
    <Helmet title="Profil"></Helmet>
    <Flex flexDirection="column" height="100%">
      <Flex px={2} color="white" bg="secondary" alignItems="center">
        <Text p={2} fontWeight="bold">
          <FormattedMessage
            id="app.stats.menu.profile"
            defaultMessage="Profile"
            description="Profile text"
          />
        </Text>
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
      </Flex>
      <Routes>
        <Route index element={<Stats user={user} />} />
        <Route path="stats" element={<Stats user={user} />} />
        <Route path="settings" element={<Settings user={user} />} />
      </Routes>
    </Flex>
  </Container>
);

export { Profile };
