import React from 'react';
import { Flex, Heading } from 'rebass';
import { useHistory } from 'react-router-dom';
import { MenuButton, Container } from '../../components';

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
            textAlign="center"
            color="lightgray"
            fontFamily="Impact"
            fontSize={80}
          >
            TIP FOR SCIENCE
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
              about
            </MenuButton>
            {isSignedIn && (
              <MenuButton ml="2" flex="1" onClick={handleClickStats}>
                stats
              </MenuButton>
            )}
          </Flex>
          {isSignedIn && (
            <>
              {user && user.role === UserRole.admin && (
                <MenuButton onClick={handleClickDashboard} mb="2">
                  dashboard
                </MenuButton>
              )}
              <MenuButton onClick={handleClickPlay} mb="2">
                play
              </MenuButton>
              <MenuButton onClick={handleClickLogOut}>log out</MenuButton>
            </>
          )}
          {!isSignedIn && (
            <MenuButton onClick={handleClickSignIn}>sign in</MenuButton>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};
export { Home };
