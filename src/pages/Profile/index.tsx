import React, { ReactNode } from 'react';
import { Link as RouterLink, Switch, Route, Redirect } from 'react-router-dom';
import { Flex, Link, Text, Box } from 'rebass';
import { Stats } from './Stats';
import { Settings } from './Settings';
import { Container } from '../../components';
import { User } from '../../types';
import Helmet from 'react-helmet';

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
          Profil
        </Text>
        <Box mx="auto" />
        <NavbarLink to="/profile/stats">Stats</NavbarLink>
        <NavbarLink to="/profile/settings" color="black">
          Nastavení
        </NavbarLink>
        <NavbarLink to="/">Domů</NavbarLink>
      </Flex>
      <Switch>
        <Route path=".">
          <Stats user={user} />
        </Route>
        <Route path="/profile/stats">
          <Stats user={user} />
        </Route>
        <Route path="/profile/settings">
          <Settings user={user} />
        </Route>
        <Redirect from="/" to="/profile/stats" />
      </Switch>
    </Flex>
  </Container>
);

export { Profile };
