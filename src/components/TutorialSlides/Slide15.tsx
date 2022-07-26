import { useQuery } from '@apollo/client';
import React from 'react';
import { useHistory } from 'react-router';
import { Button, Flex, Image, Text } from 'rebass';
import { Spinner } from '..';
import { AUTH_QUERY } from '../../gql';
import { Container } from '../Container';
import { TutorialHeader } from '../TutorialHeader';
import logo from './../../assets/logoskoly.png';
import { SlideProps } from './types';

const imageStyle = {
  minHeight: '210px',
  width: '100%',
  alignSelf: 'center',
};

const Slide15 = (props: SlideProps) => {
  const { loading, data } = useQuery(AUTH_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const isLoggedIn = !!data?.viewer?.user;

  const history = useHistory();
  const handleClickHome = () => {
    history.push('/');
  };
  const handleClickPlay = () => {
    history.push('/play');
  };
  const handleClickSignIn = () => {
    history.push('/signin');
  };

  return (
    <Container>
      <TutorialHeader>
        <Text
          fontSize={[3, 4, 5]}
          color="secondary"
          textAlign="center"
          p={3}
        >
          To je vše, nyní jsi připraven na hru naostro!
        </Text>
      </TutorialHeader>
      <Image src={logo} sx={imageStyle} />
      <Text
        fontSize={[3, 4, 5]}
        color="secondary"
        textAlign="center"
        p={3}
      >
        Tip for Science bylo vytvořeno evolučními biology z Univerzity Karlovy.
      </Text>
      <Button onClick={handleClickHome}>Domů</Button>
      {loading && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {!loading && isLoggedIn && (
        <Button onClick={handleClickPlay}>Začít hrát</Button>
      )}
      {!loading && !isLoggedIn && (
        <Button onClick={handleClickSignIn}>Přihlásit se</Button>
      )}
    </Container>
  );
};

export { Slide15 };
