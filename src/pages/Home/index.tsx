import React from 'react';
import { injectGlobal } from 'emotion';
import { Flex, Heading, Image } from 'rebass';
import { useHistory } from 'react-router-dom';
import { MenuButton, Container } from '../../components';
import { TargetImage } from '../../components/TargetImage';

enum UserRole {
  admin = 'admin',
  player = 'player',
}
interface User {
  role: UserRole;
}
interface HomeProps {
  user: User | null;
  onLogOut: Function;
}

injectGlobal`
  body {
    background-color: #161616 !important;
  }
`;

const Home = ({ user, onLogOut }: HomeProps) => {
  const isSignedIn = !!user;
  const history = useHistory();

  const handleClickAbout = () => {
    history.push('/about');
  };

  const handleClickDashboard = () => {
    history.push('/dashboard');
  };

  const handleClickPlay = () => {
    history.push('/play');
  };

  const handleClickStats = () => {
    history.push('/stats');
  };

  const handleClickSignIn = () => {
    history.push('/signin');
  };

  const handleClickLogOut = () => {
    onLogOut();
  };

  return (
    <Container>
      <TargetImage />
      <Flex
        flexDirection="column"
        justifyContent="center"
        height="100%"
        width="100%"
        p="3"
      >
        <Flex
          sx={{ flexGrow: 2 }}
          justifyContent="center"
          flexDirection="column"
        >
          <Heading
            textAlign="left"
            color="#D6D6D6"
            fontFamily="Raleway"
            fontWeight={900}
            lineHeight="0.85em"
            mx="auto"
            fontSize={80}
          >
            TIP FOR <br />
            SCIENCE
          </Heading>
        </Flex>
        <Flex
          flexDirection="column"
          sx={{
            flexGrow: 1,
            flexShrink: 0,
          }}
        >
          <Flex mb="2">
            <MenuButton flex="1" onClick={handleClickAbout}>
              About
            </MenuButton>
            {isSignedIn && (
              <MenuButton ml="2" flex="1" onClick={handleClickStats}>
                Stats
              </MenuButton>
            )}
          </Flex>
          {isSignedIn && (
            <>
              {user && user.role === UserRole.admin && (
                <MenuButton onClick={handleClickDashboard} mb="2">
                  Dashboard
                </MenuButton>
              )}
              <MenuButton onClick={handleClickPlay} mb="2" primary>
                Play
              </MenuButton>
              <MenuButton onClick={handleClickLogOut}>Sign out</MenuButton>
            </>
          )}
          {!isSignedIn && (
            <MenuButton onClick={handleClickSignIn} primary>
              Sign in
            </MenuButton>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};
export { Home };
