import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Flex, Heading, Text } from 'rebass';
import { useHistory } from 'react-router-dom';
import { MenuButton, Container } from '../../components';
import { TargetImage } from '../../components/TargetImage';
import { User, UserRole } from '../../types';

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

  const handleClickProfile = () => {
    history.push('/profile');
  };

  const handleClickSignIn = () => {
    history.push('/signin');
  };

  const handleClickLogOut = () => {
    onLogOut();
  };

  return (
    <Container>
      <Helmet title="Home"></Helmet>
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
            <FormattedMessage id="app.home.menu.tutorial"
                  defaultMessage="Tutorial"
                  description="Tutorial button" />
            </MenuButton>
            {isSignedIn && (
              <MenuButton ml="2" flex="1" onClick={handleClickProfile}>
                <FormattedMessage id="app.home.menu.profile"
                  defaultMessage="Profile"
                  description="Profile button" />
              </MenuButton>
            )}
          </Flex>
          {isSignedIn && (
            <>
              {user && user.role === UserRole.admin && (
                <MenuButton onClick={handleClickDashboard} mb="2" primary>
                  <FormattedMessage id="app.home.menu.dashboard"
                    defaultMessage="Dashboard"
                    description="Dashboard button" />
                </MenuButton>
              )}
              {user && user.role !== UserRole.admin && (
                <MenuButton onClick={handleClickPlay} mb="2" primary>
                  <FormattedMessage id="app.home.menu.play"
                    defaultMessage="Play"
                    description="Play button" />
                </MenuButton>
              )}
              <MenuButton onClick={handleClickLogOut}>
                <FormattedMessage id="app.home.menu.logout"
                  defaultMessage="Log out"
                  description="Logout button" />
              </MenuButton>
            </>
          )}
          {!isSignedIn && (
            <MenuButton onClick={handleClickSignIn} primary>
              <FormattedMessage id="app.home.menu.login"
                defaultMessage="Log in"
                description="Login button" />
            </MenuButton>
          )}
        </Flex>
      </Flex>
      <Text
        mt="auto"
        mb={4}
        color="neutralFade"
        textAlign="center"
        fontSize={1}
      >
        <FormattedMessage id="app.home.footer.beta"
          defaultMessage="This is just a beta version. If you encounter any bug,{br} contact us at tipforscience@protonmail.com"
          description="Beta warning"
          values={{ br: <br /> }} />
      </Text>
    </Container>
  );
};
export { Home };
