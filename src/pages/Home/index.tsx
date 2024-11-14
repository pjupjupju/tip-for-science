import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Flex, Heading, Text } from 'rebass';
import { useNavigate } from 'react-router-dom';
import { MenuButton, Container } from '../../components';
import { TargetImage } from '../../components/TargetImage';
import { User, UserRole } from '../../types';
import { Stack } from '@mui/material';

interface HomeProps {
  user: User | null;
  onLogOut: Function;
}

const Home = ({ user, onLogOut }: HomeProps) => {
  const isSignedIn = !!user;
  const navigate = useNavigate();

  const handleClickAbout = () => {
    navigate('/about');
  };

  const handleClickDashboard = () => {
    navigate('/dashboard');
  };

  const handleClickPlay = () => {
    navigate('/play');
  };

  const handleClickProfile = () => {
    navigate('/profile');
  };

  const handleClickSignUp = () => {
    navigate('/signup');
  };

  const handleClickLogOut = () => {
    onLogOut();
  };

  const buttonStyles = { flex: 1 };

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
        <Stack flexDirection="column" flexGrow={1} flexShrink={0} spacing={1}>
          <Stack direction="row" spacing={1}>
            <MenuButton sx={buttonStyles} onClick={handleClickAbout}>
              <FormattedMessage
                id="app.home.menu.tutorial"
                defaultMessage="Tutorial"
                description="Tutorial button"
              />
            </MenuButton>
            {isSignedIn && (
              <MenuButton sx={buttonStyles} onClick={handleClickProfile}>
                <FormattedMessage
                  id="app.home.menu.profile"
                  defaultMessage="Profile"
                  description="Profile button"
                />
              </MenuButton>
            )}
          </Stack>
          {isSignedIn && (
            <>
              {user && user.role === UserRole.admin && (
                <MenuButton onClick={handleClickDashboard} primary>
                  <FormattedMessage
                    id="app.home.menu.dashboard"
                    defaultMessage="Dashboard"
                    description="Dashboard button"
                  />
                </MenuButton>
              )}
              {user && user.role !== UserRole.admin && (
                <MenuButton onClick={handleClickPlay} primary>
                  <FormattedMessage
                    id="app.home.menu.play"
                    defaultMessage="Play"
                    description="Play button"
                  />
                </MenuButton>
              )}
              <MenuButton onClick={handleClickLogOut}>
                <FormattedMessage
                  id="app.home.menu.logout"
                  defaultMessage="Log out"
                  description="Logout button"
                />
              </MenuButton>
            </>
          )}
          {!isSignedIn && (
            <MenuButton onClick={handleClickSignUp} primary>
              <FormattedMessage
                id="app.home.menu.signup"
                defaultMessage="Sign up"
                description="Sign up"
              />
            </MenuButton>
          )}
        </Stack>
      </Flex>
      <Text
        mt="auto"
        mb={4}
        color="neutralFade"
        textAlign="center"
        fontSize={1}
      >
        <FormattedMessage
          id="app.home.footer.beta"
          defaultMessage="This is just a beta version. If you encounter any bug,{lineBreak} contact us at tipforscience@protonmail.com"
          description="Beta warning"
          values={{
            lineBreak: <br />,
          }}
        />
      </Text>
    </Container>
  );
};
export { Home };
