import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

import { TranslucentBox } from '../TranslucentBox';
import { Container } from '../Container';

interface GameOverScreenProps {
  onContinue: Function;
}

const leftButtonStyles = { flex: 1 };
const rightButtonStyles = { flex: 3 };

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
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Typography
            fontSize="clamp(36px, 6vw, 60px)"
            textAlign="center"
            fontWeight={600}
            marginY={2}
            color="white"
          >
            GAME OVER
          </Typography>
          <Typography align="center" fontWeight={500} marginY={2} color="white">
            <FormattedMessage
              id="app.game.gameover"
              defaultMessage="Time’s up! You can continue with the next question or take a break."
              description="Game over"
            />
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%"
            marginTop={6}
            gap={1}
          >
            <Button
              onClick={handleClickHome}
              variant="contained"
              color="secondary"
              sx={leftButtonStyles}
            >
              <FormattedMessage
                id="app.tutorial.menu.home"
                defaultMessage="Home"
                description="Tut home button"
              />
            </Button>
            <Button
              onClick={handleClickPlay}
              variant="contained"
              sx={rightButtonStyles}
            >
              <FormattedMessage
                id="app.game.continue"
                defaultMessage="Continue"
                description="Continue"
              />
            </Button>
          </Stack>
        </Stack>
      </Container>
    </TranslucentBox>
  );
};

export { GameOverScreen };
