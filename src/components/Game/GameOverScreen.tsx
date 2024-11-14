import React from 'react';
import { Text, Flex, Button } from 'rebass';
import { useNavigate } from 'react-router-dom';
import { TranslucentBox } from '../TranslucentBox';
import { Container } from '../Container';
import { FormattedMessage } from 'react-intl';

interface GameOverScreenProps {
  onContinue: Function;
}

const GameOverScreen = ({ onContinue }: GameOverScreenProps) => {
  const navigate = useNavigate();
  const handleClickHome = () => {
    navigate('/');
  };
  const handleClickPlay = () => {
    onContinue();
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
            <FormattedMessage
              id="app.game.gameover"
              defaultMessage="Time’s up! You can continue with the next question or take a break."
              description="Game over"
            />
          </Text>

          <Flex justifyContent="space-between" width="100%" mt={6}>
            <Button
              onClick={handleClickHome}
              sx={{ flex: 1 }}
              mr={1}
              backgroundColor={'#414141'}
            >
              <FormattedMessage
                id="app.tutorial.menu.home"
                defaultMessage="Home"
                description="Tut home button"
              />
            </Button>
            <Button onClick={handleClickPlay} sx={{ flex: 3 }}>
              <FormattedMessage
                id="app.game.continue"
                defaultMessage="Continue"
                description="Continue"
              />
            </Button>
          </Flex>
        </Flex>
      </Container>
    </TranslucentBox>
  );
};

export { GameOverScreen };
