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
  maxHeight: '350px',
  width: 'auto',
  alignSelf: 'center',
  px: [4, 4, 6],
  py: 3,
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
        <Text fontSize={[4, 4, 5]} color="secondary" textAlign="center" p={4}>
          To je vše, nyní jsi připraven*a na hru naostro!
        </Text>
      </TutorialHeader>
      <Image src={logo} sx={imageStyle} />
      <Text fontSize={[2, 3, 4]} color="secondary" textAlign="center" p={3}>
        Tip for Science bylo vytvořeno evolučními biology
        <br />
        z Univerzity Karlovy.
      </Text>
      <Flex marginTop={'auto'}>
        <Button
          onClick={handleClickHome}
          sx={{ flex: 1 }}
          mr={1}
          backgroundColor={'#414141'}
        >
          Domů
        </Button>
        {loading && (
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        )}
        {!loading && isLoggedIn && (
          <Button onClick={handleClickPlay} sx={{ flex: 3 }}>
            Začít hrát
          </Button>
        )}
        {!loading && !isLoggedIn && (
          <Button onClick={handleClickSignIn} sx={{ flex: 3 }}>
            Přihlásit se
          </Button>
        )}
      </Flex>
    </Container>
  );
};

export { Slide15 };
