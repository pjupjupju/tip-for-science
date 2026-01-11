import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TranslucentBox } from '../TranslucentBox';
import { Container } from '../Container';
import { FormattedMessage } from 'react-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              textAlign: 'center',
              my: 2,
              color: 'white',
            }}
          >
            GAME OVER
          </Typography>
          <Typography
            align="center"
            sx={{
              fontWeight: 500,
              my: 2,
              color: 'white',
            }}
          >
            <FormattedMessage
              id="app.game.gameover"
              defaultMessage="Time’s up! You can continue with the next question or take a break."
              description="Game over"
            />
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              mt: 6,
            }}
          >
            <Button
              onClick={handleClickHome}
              variant="contained"
              color="secondary"
              sx={{ flex: 1, mr: 1 }}
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
              sx={{ flex: 3 }}
            >
              <FormattedMessage
                id="app.game.continue"
                defaultMessage="Continue"
                description="Continue"
              />
            </Button>
          </Box>
        </Box>
      </Container>
    </TranslucentBox>
  );
};

export { GameOverScreen };
