import React from 'react';
import { Text, Flex, Button } from 'rebass';
import { TranslucentBox } from '../TranslucentBox';
import { Container } from '../Container';
import { useHistory } from 'react-router';

const GameOverScreen = () => {
  const history = useHistory();
  const handleClickHome = () => {
    history.push('/');
  };
  const handleClickPlay = () => {
    history.push('/play');
  };

  return (
    <TranslucentBox>
      <Container>
        <Flex
          p={3}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Text
            fontSize={6}
            fontWeight={700}
            textAlign="center"
            my={2}
            color="white"
          >
            GAME OVER
          </Text>
          <Text fontWeight={500} textAlign="center" my={2} color="white">
            Vypršel ti čas. Můžeš pokračovat, nebo si dát pauzu :)
          </Text>

          <Flex justifyContent="space-between" width="100%" mt={6}>
            <Button
              onClick={handleClickHome}
              sx={{ flex: 1 }}
              mr={1}
              backgroundColor={'#414141'}
            >
              Domů
            </Button>
            <Button onClick={handleClickPlay} sx={{ flex: 3 }}>
              Pokračovat ve hře
            </Button>
          </Flex>
        </Flex>
      </Container>
    </TranslucentBox>
  );
};

export { GameOverScreen };
