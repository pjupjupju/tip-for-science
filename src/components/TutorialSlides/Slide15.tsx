import { useQuery } from '@apollo/client';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Image, Text } from 'rebass';
import { HomeButton, Spinner } from '..';
import { AUTH_QUERY } from '../../gql';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import logo from './../../assets/logoskoly.png';
import { FormattedMessage } from 'react-intl';

const imageStyle = {
  minHeight: '210px',
  maxHeight: '350px',
  width: 'auto',
  alignSelf: 'center',
  px: [4, 4, 6],
  py: 3,
};

const Slide15 = () => {
  const { loading, data } = useQuery(AUTH_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const isLoggedIn = !!data?.viewer?.user;
  const isAdmin = data?.viewer?.user?.role === 'admin';

  const navigate = useNavigate();
  const handleClickPlay = () => {
    navigate('/play');
  };
  const handleClickSignUp = () => {
    navigate('/signup');
  };

  return (
    <Container>
      <TutorialHeader>
        <Text fontSize={[4, 4, 5]} color="secondary" textAlign="center" p={4}>
          <FormattedMessage
            id="app.tutorial.slide.ready"
            defaultMessage="That's it! You're now ready to play for real!"
            description="Tut15 ready"
          />
        </Text>
      </TutorialHeader>
      <Image src={logo} sx={imageStyle} />
      <Text fontSize={[2, 3, 4]} color="secondary" textAlign="center" p={3}>
        <FormattedMessage
          id="app.tutorial.slide.byeb"
          defaultMessage="Tip for Science was created by evolutionary biologists {lineBreak}
            from Charles University."
          description="Tut15 by EB"
          values={{
            lineBreak: <br />,
          }}
        />
      </Text>
      <Flex marginTop={'auto'}>
        <HomeButton />
        {loading && (
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        )}
        {!loading && isLoggedIn && !isAdmin && (
          <Button onClick={handleClickPlay} sx={{ flex: 3 }}>
            <FormattedMessage
              id="app.tutorial.slide.play"
              defaultMessage="Play"
              description="Tut15 play"
            />
          </Button>
        )}
        {!loading && !isLoggedIn && (
          <Button onClick={handleClickSignUp} sx={{ flex: 3 }}>
            <FormattedMessage
              id="app.tutorial.slide.signin"
              defaultMessage="Sign in"
              description="Tut15 signin"
            />
          </Button>
        )}
      </Flex>
    </Container>
  );
};

export { Slide15 };
