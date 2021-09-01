import React from 'react';
import { Flex, Heading } from 'rebass';
import { useHistory } from 'react-router-dom';
import { MenuButton, Container } from '../../components';

const Home = ({ isSignedIn = false }) => {
  const history = useHistory();
  const handleClickAbout = () => {
    history.push('/about');
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
            <MenuButton mr="1" flex="1" onClick={handleClickAbout}>
              about
            </MenuButton>
            {isSignedIn && (
              <MenuButton ml="1" flex="1" onClick={handleClickStats}>
                stats
              </MenuButton>
            )}
          </Flex>
          {isSignedIn && (
            <MenuButton onClick={handleClickPlay}>play</MenuButton>
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
